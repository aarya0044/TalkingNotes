import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import type { ChatMessage, InsertChatMessage } from "@shared/schema";

export default function ConsoleSection() {
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: InsertChatMessage) => {
      const response = await apiRequest("POST", "/api/chat/messages", message);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      setChatInput("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/chat/messages");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      toast({
        title: "Chat cleared",
        description: "Your chat history has been cleared.",
      });
    },
  });

  const handleSendMessage = () => {
    if (!chatInput.trim() || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({
      message: chatInput,
      isUser: 'true'
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const useComfortPrompt = (prompt: string) => {
    setChatInput(prompt);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const comfortPrompts = [
    "I'm feeling overwhelmed",
    "I need encouragement", 
    "I'm having a hard day",
    "Help me feel better"
  ];

  if (isLoading) {
    return (
      <div className="bg-card rounded-3xl shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded-lg"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          <div className="space-y-4">
            <div className="h-16 bg-muted rounded-2xl"></div>
            <div className="h-16 bg-muted rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-light text-foreground mb-3">Talk to the app</h2>
        <p className="text-muted-foreground text-lg">I'm here to listen and comfort you</p>
      </div>
      
      {/* Chat Messages */}
      <div className="space-y-6 mb-8 max-h-96 overflow-y-auto" data-testid="chat-messages-container">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Start a conversation. I'm here to listen and support you.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.isUser === 'true' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-md p-4 rounded-2xl chat-bubble ${
                  message.isUser === 'true' 
                    ? 'bg-primary text-primary-foreground rounded-tr-md' 
                    : 'comfort-response text-accent-foreground rounded-tl-md shadow-sm'
                }`}
                data-testid={`message-${message.id}`}
              >
                <p className="whitespace-pre-wrap">{message.message}</p>
                <div className="text-xs opacity-70 mt-1">
                  {formatTime(message.createdAt.toString())}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="flex space-x-3">
        <input 
          type="text" 
          placeholder="Share what's on your mind..."
          className="flex-1 p-4 bg-input border-2 border-border rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground text-foreground"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={sendMessageMutation.isPending}
          data-testid="input-chat-message"
        />
        
        <button 
          className="bg-primary text-primary-foreground p-4 rounded-2xl hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
          onClick={handleSendMessage}
          disabled={sendMessageMutation.isPending || !chatInput.trim()}
          data-testid="button-send-message"
        >
          <Send className="h-6 w-6" />
        </button>
      </div>
      
      {/* Comfort Suggestions */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-muted-foreground">Need some comfort? Try asking:</h4>
          {messages.length > 0 && (
            <button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => clearHistoryMutation.mutate()}
              disabled={clearHistoryMutation.isPending}
              data-testid="button-clear-chat"
            >
              Clear history
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {comfortPrompts.map((prompt, index) => (
            <button 
              key={index}
              className="text-sm bg-muted text-muted-foreground px-3 py-2 rounded-xl hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              onClick={() => useComfortPrompt(prompt)}
              data-testid={`button-comfort-prompt-${index}`}
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
