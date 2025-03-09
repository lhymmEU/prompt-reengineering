"use client";

import AuthButton from "@/app/components/AuthButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">
            Prompt Engineering Assistant
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Enhance your prompts with AI-powered suggestions and improvements
          </p>
          <div className="flex justify-center space-x-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  );
}
