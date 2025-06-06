import { NextResponse } from 'next/server';
import { OpenAI } from 'openai'; 
import { createClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const supabase = createClient();


  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Authorization header missing' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, 
    });


    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI content generator',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
    });


    const content = completion.choices[0]?.message?.content || 'No response content';

    return NextResponse.json({
      content,
    });

  } catch (error) {
    console.error('Generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
