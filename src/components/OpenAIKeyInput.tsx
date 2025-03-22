
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { KeyRound } from 'lucide-react';

const OpenAIKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);

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

  if (isKeySet) {
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
  );
};

export default OpenAIKeyInput;
