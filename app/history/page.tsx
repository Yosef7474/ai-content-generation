'use client'
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase'; // Ensure this path is correct and matches your project structure

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
  const supabase = createClient();
  useEffect(() => {
    
    const fetchGenerations = async () => {
      const { data:  userid  } = await supabase.auth.getUser();
      console.log(userid.user?.id)
      const { data } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', `${userid.user?.id}`)
        .order('created_at', { ascending: false });


        console.log('data', data)

        setGenerations(data || []);
        setLoading(false);
}

    fetchGenerations();

   
  }, []);

  const deleteGeneration = async (id: string) => {
    await supabase
      .from('generations')
      .delete()
      .eq('id', id);
    
    setGenerations(generations.filter(gen => gen.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Content History</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : generations.length === 0 ? (
        <p>No generations yet. <a href="/generate" className="text-blue-600">Create your first one!</a></p>
      ) : (
        <div className="space-y-4">
          {generations.map((gen) => (
            <div key={gen.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{gen.content_type}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(gen.created_at).toLocaleString()}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Prompt:</span> {gen.prompt.substring(0, 100)}...
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigator.clipboard.writeText(gen.content)}
                    className="text-sm bg-gray-100 px-2 py-1 rounded"
                  >
                    Copy
                  </button>
                  <button 
                    onClick={() => deleteGeneration(gen.id)}
                    className="text-sm bg-red-100 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}