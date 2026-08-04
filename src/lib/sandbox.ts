export interface SandboxResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  output: string;
}

/**
 * Executes code using the Judge0 API via RapidAPI.
 * This is Vercel-compatible (Serverless) and entirely free.
 */
export async function executeCodeInSandbox({
  language,
  code,
}: {
  language: string;
  code: string;
}): Promise<SandboxResult> {
  const normalizedLanguage = language.toLowerCase();
  
  if (normalizedLanguage !== "python" && normalizedLanguage !== "python3" && normalizedLanguage !== "py") {
    throw new Error(`Language ${language} is not supported.`);
  }

  // If running locally, use the super-fast child_process fallback
  if (process.env.NODE_ENV !== "production") {
    return executeLocalFallback(code);
  }

  // If deployed to Vercel, hit our native Vercel Python Serverless Function
  const baseUrl = process.env.BETTER_AUTH_URL || "";
  
  const submitResponse = await fetch(`${baseUrl}/api/run_python`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ code })
  });

  if (!submitResponse.ok) {
    const errorText = await submitResponse.text().catch(() => "");
    throw new Error(`Vercel Python execution failed: ${submitResponse.status} - ${errorText}`);
  }

  return await submitResponse.json();
}

// Keep the local fallback so your local dev server doesn't break while you set up the API key!
async function executeLocalFallback(code: string): Promise<SandboxResult> {
  const { exec } = await import("child_process");
  const { writeFile, unlink } = await import("fs/promises");
  const { join } = await import("path");
  const { randomUUID } = await import("crypto");
  const os = await import("os");

  const tempFileName = join(os.tmpdir(), \`codequest_\${randomUUID()}.py\`);
  await writeFile(tempFileName, code, "utf-8");

  return new Promise((resolve) => {
    exec(
      \`python "\${tempFileName}"\`,
      { timeout: 10000 },
      async (error, stdout, stderr) => {
        await unlink(tempFileName).catch(() => {});
        resolve({
          stdout,
          stderr,
          exitCode: error ? (error.code ?? 1) : 0,
          output: stdout + stderr,
        });
      }
    );
  });
}
