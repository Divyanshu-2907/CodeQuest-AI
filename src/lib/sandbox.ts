interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
}

let runtimesCache: PistonRuntime[] = [];

async function getPistonRuntimes(): Promise<PistonRuntime[]> {
  if (runtimesCache.length > 0) return runtimesCache;
  const baseUrl = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston";
  try {
    const res = await fetch(`${baseUrl}/runtimes`);
    if (res.ok) {
      runtimesCache = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch Piston runtimes:", err);
  }
  return runtimesCache;
}

export interface SandboxResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  output: string;
}

/**
 * Executes a chunk of code in the Piston sandbox environment.
 */
export async function executeCodeInSandbox({
  language,
  code,
}: {
  language: string;
  code: string;
}): Promise<SandboxResult> {
  const runtimes = await getPistonRuntimes();
  const normalizedLanguage = language.toLowerCase();

  // Find matching runtime based on name or alias
  const match = runtimes.find(
    (r) =>
      r.language.toLowerCase() === normalizedLanguage ||
      r.aliases.map((a) => a.toLowerCase()).includes(normalizedLanguage)
  );

  const finalLanguage = match ? match.language : language;
  const version = match ? match.version : "*";

  const baseUrl = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston";

  const response = await fetch(`${baseUrl}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: finalLanguage,
      version,
      files: [
        {
          content: code,
        },
      ],
      run_timeout: 10000, // 10 seconds execution limit
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Sandbox execution failed with status ${response.status}: ${errorText || response.statusText}`);
  }

  const result = await response.json();

  return {
    stdout: result.run?.stdout || "",
    stderr: result.run?.stderr || "",
    exitCode: result.run?.code ?? 0,
    output: result.run?.output || "",
  };
}
