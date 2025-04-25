// components/AuthProvider.tsx
'use client'
import { createClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const { data: { subscription } } = createClient().auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="inline-block relative w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-80 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-gray-900"></div>
          </div>
          <p className="text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Glass navbar */}
      <nav className="border-b border-gray-800 py-4 px-6 backdrop-blur-md bg-gray-900/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo with gradient */}
          <a 
            href="/" 
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            AI Content Studio
          </a>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <a 
                  href="/dashboard" 
                  className={`px-3 py-2 rounded-lg transition-colors ${pathname === '/dashboard' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  Dashboard
                </a>
                <a 
                  href="/generate" 
                  className={`px-3 py-2 rounded-lg transition-colors ${pathname === '/generate' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  Generate
                </a>
                <a 
                  href="/history" 
                  className={`px-3 py-2 rounded-lg transition-colors ${pathname === '/history' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  History
                </a>
                <a 
                  href="/account" 
                  className={`px-3 py-2 rounded-lg transition-colors ${pathname === '/account' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  Account
                </a>
                <button
                  onClick={async () => {
                    await createClient().auth.signOut();
                    window.location.href = '/';
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-500 hover:to-pink-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a 
                  href="/login" 
                  className={`px-4 py-2 rounded-lg transition-colors ${pathname === '/login' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  Login
                </a>
                <a 
                  href="/signup" 
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-colors"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Decorative background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-900/10 blur-3xl"></div>
        </div>
        
        {children}
      </main>
    </div>
  );
}