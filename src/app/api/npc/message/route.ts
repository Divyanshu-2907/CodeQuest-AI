import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getGeminiNpcStream } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { missionId, output, trigger, attemptCount, messageHistory } = await req.json();

    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { chapter: true }
    });

    if (!mission || !mission.chapter) {
      return NextResponse.json({ error: 'Mission or chapter not found' }, { status: 404 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not defined in the server environment. Returning mock response.");
      // Return a mock stream response to prevent the UI from breaking
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: "[SYSTEM OVERRIDE] Gemini API Key missing in environment.\n\n" })}\n\n`));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: "Agent, you need to establish a secure uplink to Google AI before I can properly analyze your code.\n" })}\n\n`));
          controller.close();
        }
      });
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    const chapter = mission.chapter;
    const npcName = chapter.npcName || "Unknown Entity";
    const npcRole = chapter.npcRole || "System Daemon";
    const npcPersona = chapter.npcPersona || "Cold and robotic.";

    let triggerContext = "";
    switch(trigger) {
      case "WELCOME": triggerContext = "The player just completed onboarding and entered Neural City. Welcome them warmly, introduce yourself as Ghost (their Guide), and tell them their first hacking assignment is waiting in the grid."; break;
      case "A": triggerContext = "The player just accepted the mission. Give a short, lore-heavy briefing."; break;
      case "B": triggerContext = "The player successfully ran the code and passed! React positively and hint at what's next."; break;
      case "C": triggerContext = `The player's code failed (Attempt ${attemptCount}). Give a cryptic hint without spoiling the answer.`; break;
      case "D": triggerContext = `The player's code failed multiple times (Attempt ${attemptCount}). Give a more direct technical hint.`; break;
      case "E": triggerContext = "The player completed the mission and submitted it! Deliver a story payoff line and tease the next mission."; break;
      case "F": triggerContext = "The player has been idle for over 5 minutes. Send a nudge message to get them back on track."; break;
      default: triggerContext = "The player did something."; break;
    }

    const systemPrompt = `You are ${npcName}, ${npcRole} in Neural City. ${npcPersona} Speak in a gritty, street-smart tone — think GTA fixer meets tech underground. Keep responses under 3 sentences. Do not use markdown blocks for code unless absolutely necessary.
Current mission: ${mission.title}.
Mission objective: ${mission.briefing}.
Player's last code output: ${output || "None"}.
Trigger context: ${triggerContext}`;

    const messages = (messageHistory || []).map((msg: any) => ({
      role: msg.role === 'npc' ? 'assistant' : 'user',
      content: msg.content
    }));

    let lastTriggerMessage = `[SYSTEM NOTIFICATION]: ${triggerContext}`;

    // Ensure the last message in history is not the system notification itself if history is provided
    const historyForGemini = [...messages];
    if (historyForGemini.length > 0 && historyForGemini[historyForGemini.length - 1].role === 'user') {
      const popped = historyForGemini.pop();
      lastTriggerMessage = popped.content;
    }

    const stream = await getGeminiNpcStream({
      systemPrompt,
      messageHistory: historyForGemini,
      lastTriggerMessage,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`));
        }
        controller.close();
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('[API_NPC_MESSAGE_ERROR]', error);
    return NextResponse.json({ error: 'Internal NPC chat error' }, { status: 500 });
  }
}
