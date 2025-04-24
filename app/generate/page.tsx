'use client'
import { useState } from 'react';
import {createClient} from '@/lib/supabase';

// Define content types with descriptions
const CONTENT_TYPES = [
  {
    value: 'blog-post',
    label: 'Blog Post',
    description: 'Long-form articles with structured sections'
  },
  {
    value: 'social-media',
    label: 'Social Media',
    description: 'Short posts for platforms like Twitter or Instagram'
  },
  {
    value: 'product-desc',
    label: 'Product Description',
    description: 'Detailed explanations of product features'
  },
  {
    value: 'email',
    label: 'Email',
    description: 'Professional or marketing emails'
  }
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [contentType, setContentType] = useState(CONTENT_TYPES[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 1. Get session
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please sign in to generate content');
      }

      // 2. Make API request with auth token
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ prompt }),
      });

      console.log(session)
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setOutput(data.content);


      // Save to database
      await createClient()
        .from('generations')
        .insert([{
          user_id: session.access_token,
          prompt,
          content: data.content,
          content_type: contentType
        }]);
      
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('API Error:', {
          error: err,
          prompt,
          time: new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
      }
  
  }
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert('Copied to clipboard!');
  };



  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">AI Content Generator</h1>
      
      {/* Content Type Selection */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Content Type</label>
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="w-full p-3 border rounded mb-2 bg-white"
          disabled={isLoading}
        >
          {CONTENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label} - {type.description}
            </option>
          ))}
        </select>
      </div>
      
      {/* Prompt Input */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="font-medium">Your Prompt</label>
          <span className="text-sm text-gray-500">{charCount}/1000 characters</span>
        </div>
        <textarea
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={5}
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Describe what you want to generate. Be as specific as possible..."
          disabled={isLoading}
          maxLength={1000}
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading || !prompt.trim()}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
          isLoading 
            ? 'bg-gray-300 cursor-not-allowed' 
            : !prompt.trim() 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : 'Generate Content'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Generated Output */}
      {output && (
        <div className="mt-8 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Generated Content</h2>
            <div className="flex space-x-2">
              <button 
                onClick={handleCopy}
                className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap border">
            {output}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {output.split(/\s+/).length} words | {output.length} characters
          </div>
        </div>
      )}

      {/* Tips Section */}
      {!output && !isLoading && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">Tips for better results:</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>Be specific about your desired tone (professional, casual, etc.)</li>
            <li>Include key points you want covered</li>
            <li>Specify the target audience if relevant</li>
            <li>Example: "Write a friendly Instagram post about our new coffee blend for young professionals"</li>
          </ul>
        </div>
      )}
    </div>
  );
}