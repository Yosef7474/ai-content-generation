'use client'
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = createClient().auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await createClient().auth.signOut();
    window.location.href = '/';
  };

  return (
    <html lang="en">
      <body>
        <nav className="border-b py-4 px-6 flex justify-between items-center">
          <a href="/" className="text-xl font-bold">AI Content Generator</a>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
                <a href="/generate" className="hover:text-blue-600">Generate</a>
                <a href="/history" className="hover:text-blue-600">History</a>
                <a href="/account" className="hover:text-blue-600">Account</a>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="hover:text-blue-600">Login</a>
                <a href="/signup" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  Sign Up
                </a>
              </>
            )}
          </div>
        </nav>
        <main>
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <p>Loading...</p>
            </div>
          ) : (
            children
          )}
        </main>
      </body>
    </html>
  );
}