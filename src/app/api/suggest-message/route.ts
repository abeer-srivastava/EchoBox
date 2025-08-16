// app/api/suggest-message/route.ts
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // use Gemini instead of OpenAI
    const result = streamText({
      model: google('gemini-1.5-flash'), // you can also use gemini-1.5-pro
      prompt,
      maxOutputTokens: 400,
    });

    // send as a data stream response
    return result.toTextStreamResponse();

  } catch (error:any) {
    console.error('Gemini API error:', error);
    return new Response(
      JSON.stringify({ error: error.message ?? 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
