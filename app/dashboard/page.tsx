'use client'
import { createClient } from '@/lib/supabase';
import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Power3 } from 'gsap';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const CACHE_EXPIRY = 60 * 1000; // 60 seconds

const Dashboard = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [recentGenerations, setRecentGenerations] = useState<any[] | null>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const headerRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const getUserId = async () => {
            const client = createClient();
            const { data: userData } = await client.auth.getUser();

            const userId = userData?.user?.id;
            if (!userId) return;

            // --- Caching logic ---
            const cacheKey = `dashboard_data_${userId}`;
            const cached = localStorage.getItem(cacheKey);
            const now = Date.now();

            if (cached) {
                const parsed = JSON.parse(cached);
                if (now - parsed.timestamp < CACHE_EXPIRY) {
                    setUserName(parsed.userName);
                    setRecentGenerations(parsed.generations);
                    return;
                }
            }

            // Fetch fresh from Supabase
            const { data: user } = await client
                .from('users')
                .select('name')
                .eq('id', userId);

            if (!user || user.length === 0) return;

            setUserName(user[0]?.name);

            const { data: generations } = await client
                .from('generations')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(5);

            setRecentGenerations(generations || []);

            localStorage.setItem(
                cacheKey,
                JSON.stringify({
                    timestamp: now,
                    userName: user[0]?.name,
                    generations,
                })
            );
        };

        getUserId();
    }, []);

   

    return (
        <div 
            ref={dashboardRef}
            className="dashboard-container min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 
                        ref={headerRef}
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                    >
                        Welcome back, {userName || 'Creator'}
                    </h1>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div 
                        ref={el => { cardsRef.current[0] = el as HTMLDivElement; }}
                        className="stats-card p-8 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1"
                    >
                        <h3 className="text-lg font-semibold mb-3 text-gray-400">Total Generations</h3>
                        <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                            {recentGenerations?.length || 0}
                        </p>
                        <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-1/2"></div>
                    </div>

                    <div 
                        ref={el => { cardsRef.current[1] = el as HTMLDivElement; }}
                        className="stats-card p-8 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-1"
                    >
                        <h3 className="text-lg font-semibold mb-3 text-gray-400">Quick Actions</h3>
                        <a 
                            href="/generate" 
                            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            New Generation
                        </a>
                    </div>

                    <div 
                        ref={el => { cardsRef.current[2] = el as HTMLDivElement; }}
                        className="stats-card p-8 bg-gray-800 rounded-xl border border-gray-700 hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 transform hover:-translate-y-1"
                    >
                        <h3 className="text-lg font-semibold mb-3 text-gray-400">Recent Activity</h3>
                        <p className="text-xl font-medium">
                            {recentGenerations?.length ? `${recentGenerations.length} today` : 'No activity yet'}
                        </p>
                        <div className="mt-4 h-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-full w-1/2"></div>
                    </div>
                </div>

                <div 
                    ref={el => { cardsRef.current[3] = el as HTMLDivElement; }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            Recent Generations
                        </h2>
                        <Link 
                            href="/history" 
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center"
                        >
                            <span>View All</span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </Link>
                    </div>

                    {(recentGenerations ?? []).length > 0 ? (
                        <ul className="space-y-4">
                            {(recentGenerations ?? []).map((gen) => (
                                <li 
                                    key={gen.id} 
                                    className="generation-item border-b border-gray-700 pb-4 last:border-0 hover:bg-gray-700/30 px-3 py-2 rounded-lg transition-colors duration-200"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-lg mb-1">
                                                {gen.prompt?.substring(0, 60)}{gen.prompt?.length > 60 ? '...' : ''}
                                            </h4>
                                            <p className="text-sm text-gray-400">
                                                {gen.created_at ? new Date(gen.created_at).toLocaleString() : 'Unknown date'}
                                            </p>
                                        </div>
                                        <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition-colors duration-200">
                                            View
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-2">No generations yet</h3>
                            <p className="text-gray-400 mb-4">Start creating amazing content with your AI assistant</p>
                            <a 
                                href="/generate" 
                                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                            >
                                Create Your First Content
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
