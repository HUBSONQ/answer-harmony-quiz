
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { KeyRound, AlertCircle } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';

const OpenAIKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const { state } = useQuiz();
  const { aiError } = state;

  useEffect(() => {
    // Check if the key is already set
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setIsKeySet(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    // Simple validation to check if it looks like an OpenAI key

    // Store API key in localStorage (Note: In a production app, you'd want to store this more securely)
    localStorage.setItem('openai_api_key', apiKey);
    setIsKeySet(true);
    setApiKey('');
    toast.success('OpenAI API key saved successfully');
  };

  const handleReset = () => {
    localStorage.removeItem('openai_api_key');
    setIsKeySet(false);
    toast.info('OpenAI API key removed');
  };

  // If there's a quota error, show a more detailed error message
  const isQuotaError = aiError?.includes('usage limit') || aiError?.includes('quota');

  if (isKeySet && !isQuotaError) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <KeyRound className="w-3 h-3" />
        <span>API Key Set</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleReset}
          className="h-6 px-2 text-xs"
        >
          Reset
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isQuotaError && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-red-700">
            <p className="font-semibold">API quota exceeded</p>
            <p>Your OpenAI API key has reached its usage limit. Please enter a different API key or check your billing settings in your OpenAI account.</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 w-full max-w-md">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter OpenAI API Key"
          className="flex-1"
        />
        <Button type="submit" size="sm">
          Save API Key
        </Button>
      </form>
    </div>
  );
};

export default OpenAIKeyInput;
