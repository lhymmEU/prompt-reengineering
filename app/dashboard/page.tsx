"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PromptEngineer from "@/app/components/PromptEngineer";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmitApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/apikey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });
      
      if (response.ok) {
        setIsKeySet(true);
      }
    } catch (error) {
      console.error("Error saving API key:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!isKeySet) {
    return (
      <div className="min-h-screen p-8">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Welcome to Prompt Engineering Assistant</h1>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Enter your Groq API Key</h2>
            <p className="text-gray-600 mb-4">
              To use this application, please provide your Groq API key. Your key will be securely stored and encrypted.
            </p>
            <form onSubmit={handleSubmitApiKey}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Groq API key"
                className="w-full p-2 border rounded mb-4"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save API Key
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-3xl">
        <main>
          <h1 className="text-4xl font-bold mb-8 text-center">Prompt Engineering Assistant</h1>
          <PromptEngineer />
        </main>
      </div>
    </div>
  );
} 