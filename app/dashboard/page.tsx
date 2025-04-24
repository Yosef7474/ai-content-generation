'use client'
import { createClient } from '@/lib/supabase';
import React, { useEffect, useState } from 'react'

const page = () => {

    const [userName, setUserName] = useState(null);
    const [recentGenerations, setRecentGenerations] = useState<any[] | null>(null); 
    
    
    // handle logout
      const handleLogout = async () => {
        const { error } = await createClient().auth.signOut();
    
        if (error) {
          console.error("Error logging out:", error);
        } else {
          window.location.href = "/login";
        }
      };
    
      
    // get user id and recent generations
      const getUserId = async () => {
    
        const {data: userid} = await createClient().auth.getUser();
    
        const { data:  user } = await createClient()
          .from('users')
          .select('name')
          .eq('id', `${userid.user?.id}`)
    
          console.log('user', user)
    
        if (!user || user.length === 0) {
          console.error("Error fetching user ID");
          return;
        }
    
        setUserName(user[0]?.name);


        const { data } = await createClient()
        .from('generations')
        .select('*')
        .eq('user_id', `${userid.user?.id}`)
        .order('created_at', { ascending: false })
        .limit(5);


        console.log('data', data)
        setRecentGenerations(data || []);
    
      }



      
     
      useEffect(() => {
        getUserId();
      }, []);
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      
      <h1 className="text-3xl font-bold mb-6">Welcome back, {userName}</h1>


      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Generations</h3>
          <p className="text-2xl font-bold">{recentGenerations?.length}</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <a 
            href="/generate" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            New Generation
          </a>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Generations</h2>
        {(recentGenerations ?? []).length > 0 ? (
          <ul className="space-y-4">
            {(recentGenerations ?? []).map((gen) => (
              <li key={gen.id} className="border-b pb-4">
                <h4 className="font-medium">{gen.prompt?.substring(0, 50)}...</h4>
                <p className="text-sm text-gray-500">
                  {gen.created_at ? new Date(gen.created_at).toLocaleString() : 'Unknown date'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No generations yet. <a href="/generate" className="text-blue-600">Create your first one!</a></p>
        )}
      </div>







    </div>
  )
}

export default page