import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    // List all available models
    const models = await genAI.listModels();
    // Return the model names as JSON
    return NextResponse.json({
      models: models.map((m: any) => m.name),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
