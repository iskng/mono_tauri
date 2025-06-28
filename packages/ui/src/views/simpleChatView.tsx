import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Textarea } from "@repo/ui/components/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { useApiConfig } from "../lib/network-config";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const SimpleChatView = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiBaseUrl, isLocal, networkAddress } = useApiConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // For now, just echo the message back
    // In a real implementation, this would call the chat API
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `You said: "${userMessage.content}". (Note: Chat functionality requires backend integration)`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Chat</h1>
        {!isLocal && networkAddress && (
          <p className="text-sm text-gray-600">Using API at: {networkAddress}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Start a conversation by typing a message below.</p>
            <p className="text-sm mt-2">Note: Full chat functionality requires backend integration.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <Card key={message.id} className={message.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'}>
            <CardHeader className="py-2">
              <CardTitle className="text-sm">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        ))}
        
        {isLoading && (
          <Card className="mr-auto max-w-[80%]">
            <CardContent className="py-4">
              <p className="text-sm text-gray-500">Thinking...</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[60px] max-h-[200px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="self-end"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};