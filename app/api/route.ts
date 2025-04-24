import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Get user from auth token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    const { data: { user } } = await createClient().auth.getUser(token);
    if (!user) throw new Error('Unauthorized');

    // Parse request
    const { prompt, contentType } = await request.json();
    if (!prompt) throw new Error('Prompt is required');

    // Generate content with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant that generates ${contentType} content.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000
    });

    const generatedContent = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ 
      success: true,
      content: generatedContent
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}