'use client'
import { useState } from 'react';
import { createClient } from '@/lib/supabase';

const CONTENT_TYPES = [
  {
    value: 'blog-post',
    label: 'Blog Post',
    description: 'Long-form articles with structured sections',
    icon: '✍️'
  },
  {
    value: 'social-media',
    label: 'Social Media',
    description: 'Short posts for platforms like Twitter or Instagram',
    icon: '📱'
  },
  {
    value: 'product-desc',
    label: 'Product Description',
    description: 'Detailed explanations of product features',
    icon: '🛍️'
  },
  {
    value: 'email',
    label: 'Email',
    description: 'Professional or marketing emails',
    icon: '✉️'
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
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please sign in to generate content');
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ prompt, contentType }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setOutput(data.content);

      await createClient()
        .from('generations')
        .insert([{
          user_id: session.user.id,
          prompt,
          content: data.content,
          content_type: contentType
        }]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    // You could replace this with a toast notification
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-gray-100">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
          AI Content Generator
        </h1>
        <p className="text-gray-400">Create high-quality content in seconds</p>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        {/* Content Type Selection */}
        <div className="mb-6">
          <label className="block mb-3 font-medium text-gray-300">Content Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CONTENT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setContentType(type.value)}
                className={`p-4 rounded-lg border transition-all ${contentType === type.value 
                  ? 'border-blue-500 bg-gray-700 shadow-lg shadow-blue-500/10' 
                  : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700'}`}
                disabled={isLoading}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <h3 className="font-medium">{type.label}</h3>
                <p className="text-xs text-gray-400 mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>
        
        {/* Prompt Input */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="font-medium text-gray-300">Your Prompt</label>
            <span className="text-sm text-gray-500">{charCount}/1000</span>
          </div>
          <textarea
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
            rows={5}
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Example: 'Write a professional email to a client about delaying our project deadline by one week...'"
            disabled={isLoading}
            maxLength={1000}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
            isLoading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : !prompt.trim() 
                ? 'bg-gray-700 cursor-not-allowed text-gray-500' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-blue-500/30'
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
          <div className="mt-4 p-4 bg-red-900/30 border-l-4 border-red-500 text-red-300 rounded-lg">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Generated Output */}
      {output && (
        <div className="mt-8 bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-100">Generated Content</h2>
            <div className="flex space-x-2">
              <button 
                id="copy-btn"
                onClick={handleCopy}
                className="flex items-center text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg whitespace-pre-wrap border border-gray-600 text-gray-100">
            {output}
          </div>
          <div className="mt-3 text-sm text-gray-400 flex justify-between">
            <span>{output.split(/\s+/).length} words</span>
            <span>{output.length} characters</span>
          </div>
        </div>
      )}

      {/* Tips Section */}
      {!output && !isLoading && (
        <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="font-medium text-blue-400 mb-3">Tips for better results:</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Specify tone: <span className="text-gray-400">"Write a friendly Instagram post..."</span></span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Include key points: <span className="text-gray-400">"Mention the 30% discount and free shipping"</span></span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Define audience: <span className="text-gray-400">"For young professionals aged 25-35"</span></span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Provide examples: <span className="text-gray-400">"Similar to our previous campaign about sustainability"</span></span>
            </li>
          </ul>
        </div>
      )}

      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-900/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-purple-900/10 blur-3xl"></div>
      </div>
    </div>
  );
}