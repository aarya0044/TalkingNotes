import { type Note, type InsertNote, type Poem, type InsertPoem, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Notes
  getNotes(): Promise<Note[]>;
  getNote(id: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;

  // Poems
  getPoems(): Promise<Poem[]>;
  getPoem(id: string): Promise<Poem | undefined>;
  createPoem(poem: InsertPoem): Promise<Poem>;
  updatePoem(id: string, poem: Partial<InsertPoem>): Promise<Poem | undefined>;
  deletePoem(id: string): Promise<boolean>;

  // Chat Messages
  getChatMessages(): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  clearChatHistory(): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private notes: Map<string, Note>;
  private poems: Map<string, Poem>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.notes = new Map();
    this.poems = new Map();
    this.chatMessages = new Map();
  }

  // Notes methods
  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const now = new Date();
    const note: Note = { 
      ...insertNote, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updateData: Partial<InsertNote>): Promise<Note | undefined> {
    const existingNote = this.notes.get(id);
    if (!existingNote) return undefined;

    const updatedNote: Note = {
      ...existingNote,
      ...updateData,
      updatedAt: new Date()
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Poems methods
  async getPoems(): Promise<Poem[]> {
    return Array.from(this.poems.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getPoem(id: string): Promise<Poem | undefined> {
    return this.poems.get(id);
  }

  async createPoem(insertPoem: InsertPoem): Promise<Poem> {
    const id = randomUUID();
    const now = new Date();
    const poem: Poem = { 
      ...insertPoem, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.poems.set(id, poem);
    return poem;
  }

  async updatePoem(id: string, updateData: Partial<InsertPoem>): Promise<Poem | undefined> {
    const existingPoem = this.poems.get(id);
    if (!existingPoem) return undefined;

    const updatedPoem: Poem = {
      ...existingPoem,
      ...updateData,
      updatedAt: new Date()
    };
    this.poems.set(id, updatedPoem);
    return updatedPoem;
  }

  async deletePoem(id: string): Promise<boolean> {
    return this.poems.delete(id);
  }

  // Chat Messages methods
  async getChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async clearChatHistory(): Promise<boolean> {
    this.chatMessages.clear();
    return true;
  }
}

export const storage = new MemStorage();
