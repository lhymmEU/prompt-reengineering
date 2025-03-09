'use client';

import { useState } from 'react';
import { Copy, Wand2 } from 'lucide-react';

const models = [
  // Large Language Models
  { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', category: 'Text' },
  { value: 'llama2-70b-4096', label: 'LLaMA2 70B', category: 'Text' },
  { value: 'gemma-7b-it', label: 'Gemma 7B', category: 'Text' },
  // Image Generation
  { value: 'sdxl', label: 'Stable Diffusion XL', category: 'Image' },
  { value: 'dalle3', label: 'DALL-E 3', category: 'Image' },
  { value: 'midjourney', label: 'Midjourney', category: 'Image' },
  // Audio Generation
  { value: 'musicgen', label: 'MusicGen', category: 'Audio' },
  { value: 'bark', label: 'Bark', category: 'Audio' },
  // Code Generation
  { value: 'codellama', label: 'Code Llama', category: 'Code' },
  { value: 'copilot', label: 'GitHub Copilot', category: 'Code' },
];

export default function PromptEngineer() {
  const [userInput, setUserInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[0].value);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/engineer-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userInput,
          model: selectedModel,
        }),
      });
      
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Your Intentions
        </label>
        <textarea
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter your intentions here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Select Model
        </label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {Object.entries(
            models.reduce((acc, model) => {
              if (!acc[model.category]) acc[model.category] = [];
              acc[model.category].push(model);
              return acc;
            }, {} as Record<string, typeof models>)
          ).map(([category, categoryModels]) => (
            <optgroup key={category} label={category}>
              {categoryModels.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <button
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        onClick={handleSubmit}
        disabled={isLoading || !userInput}
      >
        {isLoading ? (
          'Processing...'
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Modify
          </>
        )}
      </button>

      {result && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium leading-none">
              Generated Prompt
            </label>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-8 px-3"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-md border bg-muted p-4">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 