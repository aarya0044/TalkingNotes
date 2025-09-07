import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Poem, InsertPoem } from "@shared/schema";

export default function PoemsSection() {
  const [currentPoem, setCurrentPoem] = useState({ title: "", content: "" });
  const { toast } = useToast();

  const { data: poems = [], isLoading } = useQuery<Poem[]>({
    queryKey: ["/api/poems"],
  });

  const createPoemMutation = useMutation({
    mutationFn: async (poem: InsertPoem) => {
      const response = await apiRequest("POST", "/api/poems", poem);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/poems"] });
      setCurrentPoem({ title: "", content: "" });
      toast({
        title: "Poem saved",
        description: "Your poem has been saved successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save poem. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSavePoem = () => {
    if (!currentPoem.content.trim()) {
      toast({
        title: "Empty poem",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    const title = currentPoem.title.trim() || "Untitled Poem";
    const wordCount = currentPoem.content.trim().split(/\s+/).length.toString();

    createPoemMutation.mutate({
      title,
      content: currentPoem.content,
      wordCount,
    });
  };

  const handleGeneratePoem = () => {
    const inspirationalPrompts = [
      "Write about a moment when you felt truly at peace...",
      "Describe the colors of your emotions today...",
      "Capture a memory that makes you smile...",
      "Express what hope looks like to you...",
      "Write about the strength you carry within...",
      "Describe a place where you feel safe...",
      "Express gratitude for something small but meaningful...",
      "Write about a dream you're nurturing...",
    ];

    const randomPrompt = inspirationalPrompts[Math.floor(Math.random() * inspirationalPrompts.length)];
    
    setCurrentPoem(prev => ({
      ...prev,
      content: prev.content + (prev.content ? "\n\n" : "") + randomPrompt
    }));

    toast({
      title: "✨ Inspiration delivered",
      description: "A writing prompt has been added to spark your creativity.",
    });
  };

  const openPoem = (poem: Poem) => {
    setCurrentPoem({ title: poem.title, content: poem.content });
  };

  const getWordCount = (content: string) => {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-3xl shadow-lg p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-lg"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-12 bg-muted rounded-xl"></div>
            <div className="h-48 bg-muted rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Poem Writing Area */}
      <div className="bg-card rounded-3xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-light text-foreground mb-3">Express through poetry</h2>
          <p className="text-muted-foreground text-lg">Let your emotions flow in verse</p>
        </div>
        
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Give your poem a title..."
            className="w-full p-4 bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground text-foreground text-xl font-medium mb-4"
            value={currentPoem.title}
            onChange={(e) => setCurrentPoem(prev => ({ ...prev, title: e.target.value }))}
            data-testid="input-poem-title"
          />
          
          <textarea 
            className="writing-area w-full p-6 bg-input border-2 border-border rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground text-foreground text-lg leading-loose font-serif resize-none"
            placeholder="Write your poem here..."
            value={currentPoem.content}
            onChange={(e) => setCurrentPoem(prev => ({ ...prev, content: e.target.value }))}
            data-testid="textarea-poem-content"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <button 
              className="bg-secondary text-secondary-foreground px-6 py-3 rounded-xl font-medium hover:bg-secondary/90 transition-all duration-200"
              onClick={handleSavePoem}
              disabled={createPoemMutation.isPending}
              data-testid="button-save-poem"
            >
              {createPoemMutation.isPending ? "Saving..." : "Save Poem"}
            </button>
            
            <button 
              className="bg-accent text-accent-foreground px-6 py-3 rounded-xl font-medium hover:bg-accent/90 transition-all duration-200"
              onClick={handleGeneratePoem}
              data-testid="button-inspire-poem"
            >
              ✨ Inspire Me
            </button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span data-testid="text-poem-word-count">
              {getWordCount(currentPoem.content)} word{getWordCount(currentPoem.content) !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
      
      {/* Poetry Collection */}
      <div className="bg-card rounded-3xl shadow-lg p-8">
        <h3 className="text-2xl font-medium text-foreground mb-6">Your Poetry Collection</h3>
        
        {poems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No poems yet. Start writing to build your collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {poems.map((poem, index) => {
              const gradientClasses = [
                "bg-gradient-to-br from-muted/30 to-accent/30",
                "bg-gradient-to-br from-muted/30 to-primary/30",
                "bg-gradient-to-br from-accent/30 to-secondary/30",
              ];
              
              return (
                <div 
                  key={poem.id}
                  className={`p-6 ${gradientClasses[index % 3]} rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer border border-border/30`}
                  onClick={() => openPoem(poem)}
                  data-testid={`card-poem-${poem.id}`}
                >
                  <h4 className="font-semibold text-foreground mb-2" data-testid={`text-poem-title-${poem.id}`}>
                    {poem.title}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed" data-testid={`text-poem-excerpt-${poem.id}`}>
                    {poem.content.split('\n').slice(0, 2).join('\n')}
                    {poem.content.split('\n').length > 2 && '...'}
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span data-testid={`text-poem-date-${poem.id}`}>
                      {formatDate(poem.createdAt.toString())}
                    </span>
                    <span data-testid={`text-poem-word-count-${poem.id}`}>
                      {poem.wordCount} word{poem.wordCount !== '1' ? 's' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
