'use client'
import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState('blog-post');

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user } } = await createClient().auth.getUser();
      
      // Call your API route
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          contentType 
        }),
      });
      
      if (!response.ok) throw new Error('Generation failed');
      
      const data = await response.json();
      setOutput(data.content);
      
      // Save to database
      await createClient()
        .from('generations')
        .insert([{
          user_id: user?.id,
          prompt,
          content: data.content,
          content_type: contentType
        }]);
      
    } catch (error) {
      console.error(error);
      alert('Error generating content');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">AI Content Generator</h1>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Content Type</label>
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        >
          <option value="blog-post">Blog Post</option>
          <option value="social-media">Social Media Post</option>
          <option value="product-desc">Product Description</option>
          <option value="email">Email</option>
        </select>
        
        <label className="block mb-2 font-medium">Your Prompt</label>
        <textarea
          className="w-full p-4 border rounded-lg"
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to generate..."
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Generate Content'}
      </button>

      {output && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Generated Content</h2>
            <button 
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-sm bg-gray-100 px-3 py-1 rounded"
            >
              Copy
            </button>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}