'use client'
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function HistoryPage() {
  interface Generation {
    id: string;
    content_type: string;
    created_at: string;
    prompt: string;
    content: string;
  }

  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchGenerations = async () => {
      const cached = localStorage.getItem('cachedGenerations');
      const cachedTime = localStorage.getItem('cachedGenerationsTimestamp');

      // Use cache if it's less than 10 minutes old
      if (cached && cachedTime && Date.now() - parseInt(cachedTime) < 10 * 60 * 1000) {
        setGenerations(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const { data: userid } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', userid.user?.id)
        .order('created_at', { ascending: false });

      const gens = data || [];
      setGenerations(gens);
      localStorage.setItem('cachedGenerations', JSON.stringify(gens));
      localStorage.setItem('cachedGenerationsTimestamp', Date.now().toString());
      setLoading(false);
    };

    fetchGenerations();
  }, []);

  const deleteGeneration = async (id: string) => {
    await supabase
      .from('generations')
      .delete()
      .eq('id', id);

    const updated = generations.filter(gen => gen.id !== id);
    setGenerations(updated);
    localStorage.setItem('cachedGenerations', JSON.stringify(updated));
    localStorage.setItem('cachedGenerationsTimestamp', Date.now().toString());

    if (selectedGeneration?.id === id) {
      setSelectedGeneration(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'blog-post': return '✍️';
      case 'social-media': return '📱';
      case 'product-desc': return '🛍️';
      case 'email': return '✉️';
      default: return '📄';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 min-h-screen bg-gray-900 text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Your Content History
        </h1>
        <p className="text-gray-400 mt-2">Review and manage your generated content</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : generations.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-medium mb-2">No content yet</h3>
          <p className="text-gray-400 mb-6">Your generated content will appear here</p>
          <a
            href="/generate"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-colors"
          >
            Generate Your First Content
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {generations.map((gen) => (
              <div
                key={gen.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-blue-500 ${selectedGeneration?.id === gen.id ? 'border-blue-500 bg-gray-800' : 'border-gray-700 bg-gray-800/50'}`}
                onClick={() => setSelectedGeneration(gen)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl mt-1">{getContentTypeIcon(gen.content_type)}</span>
                    <div>
                      <h3 className="font-medium capitalize">{gen.content_type.replace('-', ' ')}</h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {new Date(gen.created_at).toLocaleString()}
                      </p>
                      <p className="text-gray-300 line-clamp-2">
                        <span className="font-semibold">Prompt:</span> {gen.prompt}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(gen.content);
                      }}
                      className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors"
                    >
                      Copy
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGeneration(gen.id);
                      }}
                      className="text-sm bg-red-900/50 hover:bg-red-900 px-3 py-1 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Preview Panel */}
          <div className="sticky top-4 h-fit">
            {selectedGeneration ? (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center">
                    <span className="mr-2">{getContentTypeIcon(selectedGeneration.content_type)}</span>
                    {selectedGeneration.content_type.replace('-', ' ')}
                  </h2>
                  <button
                    onClick={() => copyToClipboard(selectedGeneration.content)}
                    className="flex items-center text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy All
                  </button>
                </div>
                <div className="mb-4">
                  <h3 className="font-medium text-gray-300 mb-1">Prompt:</h3>
                  <p className="bg-gray-700 p-3 rounded-lg">{selectedGeneration.prompt}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-300 mb-1">Generated Content:</h3>
                  <div className="bg-gray-700 p-4 rounded-lg whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                    {selectedGeneration.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
                <div className="text-6xl mb-4">👈</div>
                <h3 className="text-xl font-medium mb-2">Select an item</h3>
                <p className="text-gray-400">Choose a generation from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-900/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-purple-900/10 blur-3xl"></div>
      </div>
    </div>
  );
}
