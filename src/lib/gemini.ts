import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn("GEMINI_API_KEY is not defined in the server environment.");
}

export const genAI = new GoogleGenerativeAI(geminiApiKey || "");

export interface ChatMessage {
  role: "npc" | "user" | "assistant" | "model";
  content: string;
}

/**
 * Creates a stream of chat responses from Gemini 2.5 Flash using NPC persona context.
 */
export async function getGeminiNpcStream({
  systemPrompt,
  messageHistory,
  lastTriggerMessage,
}: {
  systemPrompt: string;
  messageHistory: ChatMessage[];
  lastTriggerMessage: string;
}) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
  });

  // Map roles to Gemini roles ('user' or 'model')
  const history = messageHistory.map((msg) => ({
    role: msg.role === "npc" || msg.role === "assistant" || msg.role === "model" ? "model" as const : "user" as const,
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history,
  });

  const result = await chat.sendMessageStream(lastTriggerMessage);
  return result.stream;
}

/**
 * Evaluates player code using structured JSON output from Gemini 2.5 Flash.
 */
export async function evaluateCodeWithGemini({
  systemPrompt,
  userPrompt,
}: {
  systemPrompt: string;
  userPrompt: string;
}) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(userPrompt);
  const responseText = result.response.text();
  
  try {
    return JSON.parse(responseText.trim());
  } catch (e) {
    console.error("Failed to parse Gemini evaluation output:", responseText, e);
    // Return a fallback object
    return {
      score: 0,
      passed: false,
      feedback: "Neural link corruption detected. Unable to analyze code sequence.",
      xpAwarded: 0,
    };
  }
}
