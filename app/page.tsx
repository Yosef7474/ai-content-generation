'use client';
import { createClient } from "@/lib/supabase";
import { get } from "http";
import { useEffect, useState } from "react";

export default function Home() {

  return (
    <div className="min-h-screen">
    {/* Hero Section */}
    <section className="py-20 px-4 text-center">
      <h1 className="text-5xl font-bold mb-6">Generate Amazing Content with AI</h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        Create high-quality blog posts, social media content, and more in seconds.
      </p>
      <div className="space-x-4">
        <a href="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Get Started Free
        </a>
        <a href="/generate" className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50">
          Try Demo
        </a>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-12 text-center">Features</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Multiple Content Types",
            description: "Blog posts, social media, product descriptions and more"
          },
          {
            title: "Customizable Output",
            description: "Adjust tone, length and style to match your needs"
          },
          {
            title: "Save Your Work",
            description: "Access your generated content anytime from your dashboard"
          }
        ].map((feature, index) => (
          <div key={index} className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
  );
}
