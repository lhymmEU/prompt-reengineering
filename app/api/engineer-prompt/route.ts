import { NextResponse } from 'next/server';
import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

const SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to take user intentions and transform them into highly effective prompts using state-of-the-art prompt engineering techniques. Consider:

1. Clear context and objectives
2. Specific constraints and requirements
3. Role-based framing
4. Step-by-step breakdowns when needed
5. Examples or demonstrations if helpful
6. Evaluation criteria
7. Output format specifications

Transform the user's input into a well-structured, effective prompt that will achieve their goals.`;

export async function POST(req: Request) {
  try {
    const { input, model } = await req.json();

    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    // Set the model for this request
    groq.model = model;

    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(input)
    ];

    const response = await groq.invoke(messages);

    return NextResponse.json({
      result: response.content
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    );
  }
} 