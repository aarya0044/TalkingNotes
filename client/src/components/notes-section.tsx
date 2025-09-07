import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Note, InsertNote } from "@shared/schema";

export default function NotesSection() {
  const [currentNote, setCurrentNote] = useState({ title: "", content: "" });
  const [saveStatus, setSaveStatus] = useState("All changes saved");
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const createNoteMutation = useMutation({
    mutationFn: async (note: InsertNote) => {
      const response = await apiRequest("POST", "/api/notes", note);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setCurrentNote({ title: "", content: "" });
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully.",
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
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleContentChange = (content: string) => {
    setCurrentNote(prev => ({ ...prev, content }));
    setSaveStatus("Typing...");
    
    if (saveTimeout) clearTimeout(saveTimeout);
    
    const timeout = setTimeout(() => {
      setSaveStatus("All changes saved");
    }, 1000);
    
    setSaveTimeout(timeout);
  };

  const handleSaveNote = () => {
    if (!currentNote.content.trim()) {
      toast({
        title: "Empty note",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    const title = currentNote.title.trim() || 
      currentNote.content.substring(0, 50).trim() + (currentNote.content.length > 50 ? "..." : "");

    createNoteMutation.mutate({
      title,
      content: currentNote.content,
    });
  };

  const openNote = (note: Note) => {
    setCurrentNote({ title: note.title, content: note.content });
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

  useEffect(() => {
    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
    };
  }, [saveTimeout]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-3xl shadow-lg p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-lg"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-48 bg-muted rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Writing Area */}
      <div className="bg-card rounded-3xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-light text-foreground mb-3">Write your story</h2>
          <p className="text-muted-foreground text-lg">What's on your mind?</p>
        </div>
        
        <div className="mb-6">
          <textarea 
            className="writing-area w-full p-6 bg-input border-2 border-border rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground text-foreground text-lg leading-relaxed resize-none"
            placeholder="Start writing your thoughts, memories, or stories here..."
            value={currentNote.content}
            onChange={(e) => handleContentChange(e.target.value)}
            data-testid="textarea-note-content"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button 
            className="bg-secondary text-secondary-foreground px-8 py-3 rounded-2xl font-medium hover:bg-secondary/90 transition-all duration-200 shadow-sm hover:shadow-md save-indicator"
            onClick={handleSaveNote}
            disabled={createNoteMutation.isPending}
            data-testid="button-save-note"
          >
            {createNoteMutation.isPending ? "Saving..." : "Save Note"}
          </button>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span data-testid="text-save-status">{saveStatus}</span>
          </div>
        </div>
      </div>
      
      {/* Recent Notes */}
      <div className="bg-card rounded-3xl shadow-lg p-8">
        <h3 className="text-2xl font-medium text-foreground mb-6">Recent Notes</h3>
        
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No notes yet. Start writing to see your thoughts here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div 
                key={note.id}
                className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors duration-200 cursor-pointer border border-border/50"
                onClick={() => openNote(note)}
                data-testid={`card-note-${note.id}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-foreground" data-testid={`text-note-title-${note.id}`}>
                    {note.title}
                  </h4>
                  <span className="text-xs text-muted-foreground" data-testid={`text-note-date-${note.id}`}>
                    {formatDate(note.createdAt.toString())}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2" data-testid={`text-note-preview-${note.id}`}>
                  {note.content.length > 100 ? note.content.substring(0, 100) + "..." : note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
