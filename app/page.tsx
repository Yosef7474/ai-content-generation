'use client';
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Hero Section */}
      <section className="relative py-32 px-4 text-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-900/20 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-purple-900/20 blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Generate Amazing Content with AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300">
            Create high-quality blog posts, social media content, and more in seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <a 
                href="/generate" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-blue-500/30"
              >
                Start Creating
              </a>
            ) : (
              <>
                <a 
                  href="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-blue-500/30"
                >
                  Get Started Free
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to create professional content effortlessly
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '✍️',
              title: "Multiple Content Types",
              description: "Blog posts, social media, product descriptions, emails, and more"
            },
            {
              icon: '🎚️',
              title: "Customizable Output",
              description: "Adjust tone, length and style to match your brand voice"
            },
            {
              icon: '💾',
              title: "Save Your Work",
              description: "Access your generated content anytime from your dashboard"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Content?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Join thousands of creators boosting their productivity with AI
          </p>
          <a 
            href={user ? "/generate" : "/signup"} 
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-blue-500/30"
          >
            {user ? "Create Content Now" : "Start Free Trial"}
          </a>
        </div>
      </section>
    </div>
  );
}