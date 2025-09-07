import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertNoteSchema, insertPoemSchema, insertChatMessageSchema } from "@shared/schema";

const comfortingResponses = [
  "I'm here for you. You are not alone. Your feelings are valid and it's okay to feel this way.",
  "Thank you for sharing that with me. It takes courage to open up about difficult feelings.",
  "I hear you, and I want you to know that what you're going through matters. You matter.",
  "Sometimes life can feel overwhelming, but you've made it through difficult times before, and you have the strength to get through this too.",
  "Your feelings are completely understandable. It's natural to have ups and downs - that's what makes us human.",
  "I'm glad you felt comfortable enough to share this with me. Taking time to express your thoughts and feelings is an act of self-care.",
  "Remember to be gentle with yourself. You're doing the best you can with what you have right now.",
  "Every small step forward is progress, even when it doesn't feel like it. You're stronger than you realize.",
  "It's okay to take things one day at a time, or even one moment at a time. There's no pressure to have everything figured out.",
  "Your story matters, your feelings are important, and you deserve kindness - especially from yourself."
];

function getComfortingResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes('lonely') || message.includes('alone')) {
    return "I'm here for you. You are not alone. Loneliness is a feeling that many people experience, and it's okay to feel this way. Would you like to talk about what's making you feel lonely, or would you prefer to write about it in your notes?";
  }
  
  if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
    return "I hear that you're feeling sad, and I want you to know that it's completely okay to feel this way. Sadness is a natural part of the human experience. Sometimes writing about our feelings can help us process them. Have you considered putting these thoughts into words in your notes?";
  }
  
  if (message.includes('anxious') || message.includes('worried') || message.includes('stressed') || message.includes('overwhelmed')) {
    return "Feeling overwhelmed or anxious can be really challenging. Remember to breathe - you don't have to carry all of this at once. Sometimes breaking things down into smaller, manageable pieces can help. Would writing about what's weighing on your mind be helpful right now?";
  }
  
  if (message.includes('tired') || message.includes('exhausted') || message.includes('burnt out')) {
    return "It sounds like you're carrying a lot right now. Being tired - physically, emotionally, or mentally - is your body and mind's way of asking for care and rest. You deserve to take breaks and be gentle with yourself.";
  }
  
  if (message.includes('angry') || message.includes('frustrated') || message.includes('mad')) {
    return "Anger and frustration are valid emotions, and it's important to acknowledge them. Sometimes these feelings are trying to tell us something important about our boundaries or needs. Writing can be a healthy way to express and explore these feelings.";
  }
  
  if (message.includes('scared') || message.includes('afraid') || message.includes('fear')) {
    return "Fear is one of our most basic emotions, and feeling scared doesn't make you weak - it makes you human. You've been brave enough to face fears before, and you have that same courage within you now.";
  }
  
  if (message.includes('help') || message.includes('support') || message.includes('need')) {
    return "Asking for support is a sign of strength, not weakness. I'm here to listen and provide comfort through our conversation. Remember that your notes and poems can also be a form of self-support - a safe space to express and explore your thoughts.";
  }
  
  // Default comforting response
  return comfortingResponses[Math.floor(Math.random() * comfortingResponses.length)];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Notes routes
  app.get("/api/notes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notes = await storage.getNotes(userId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.get("/api/notes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const note = await storage.getNote(req.params.id, userId);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  app.post("/api/notes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(validatedData, userId);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.patch("/api/notes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertNoteSchema.partial().parse(req.body);
      const note = await storage.updateNote(req.params.id, userId, validatedData);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.delete("/api/notes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deleted = await storage.deleteNote(req.params.id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Poems routes
  app.get("/api/poems", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const poems = await storage.getPoems(userId);
      res.json(poems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poems" });
    }
  });

  app.get("/api/poems/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const poem = await storage.getPoem(req.params.id, userId);
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      res.json(poem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poem" });
    }
  });

  app.post("/api/poems", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertPoemSchema.parse(req.body);
      const poem = await storage.createPoem(validatedData, userId);
      res.status(201).json(poem);
    } catch (error) {
      res.status(400).json({ message: "Invalid poem data" });
    }
  });

  app.patch("/api/poems/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertPoemSchema.partial().parse(req.body);
      const poem = await storage.updatePoem(req.params.id, userId, validatedData);
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      res.json(poem);
    } catch (error) {
      res.status(400).json({ message: "Invalid poem data" });
    }
  });

  app.delete("/api/poems/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deleted = await storage.deletePoem(req.params.id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Poem not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete poem" });
    }
  });

  // Chat routes
  app.get("/api/chat/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getChatMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertChatMessageSchema.parse(req.body);
      const userMessage = await storage.createChatMessage(validatedData, userId);
      
      // Generate comforting response
      if (validatedData.isUser === 'true') {
        const comfortResponse = getComfortingResponse(validatedData.message);
        const botMessage = await storage.createChatMessage({
          message: comfortResponse,
          isUser: 'false'
        }, userId);
        
        res.status(201).json({ userMessage, botMessage });
      } else {
        res.status(201).json({ userMessage });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.delete("/api/chat/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearChatHistory(userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
