import {
  users,
  notes,
  poems, 
  chatMessages,
  type User,
  type UpsertUser,
  type Note,
  type InsertNote,
  type Poem,
  type InsertPoem,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Notes
  getNotes(userId: string): Promise<Note[]>;
  getNote(id: string, userId: string): Promise<Note | undefined>;
  createNote(note: InsertNote, userId: string): Promise<Note>;
  updateNote(id: string, userId: string, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: string, userId: string): Promise<boolean>;

  // Poems
  getPoems(userId: string): Promise<Poem[]>;
  getPoem(id: string, userId: string): Promise<Poem | undefined>;
  createPoem(poem: InsertPoem, userId: string): Promise<Poem>;
  updatePoem(id: string, userId: string, poem: Partial<InsertPoem>): Promise<Poem | undefined>;
  deletePoem(id: string, userId: string): Promise<boolean>;

  // Chat Messages
  getChatMessages(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage, userId: string): Promise<ChatMessage>;
  clearChatHistory(userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Notes methods
  async getNotes(userId: string): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt));
  }

  async getNote(id: string, userId: string): Promise<Note | undefined> {
    const [note] = await db
      .select()
      .from(notes)
      .where(eq(notes.id, id) && eq(notes.userId, userId));
    return note;
  }

  async createNote(insertNote: InsertNote, userId: string): Promise<Note> {
    const [note] = await db
      .insert(notes)
      .values({ ...insertNote, userId })
      .returning();
    return note;
  }

  async updateNote(id: string, userId: string, updateData: Partial<InsertNote>): Promise<Note | undefined> {
    const [note] = await db
      .update(notes)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(notes.id, id) && eq(notes.userId, userId))
      .returning();
    return note;
  }

  async deleteNote(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(notes)
      .where(eq(notes.id, id) && eq(notes.userId, userId));
    return (result.rowCount ?? 0) > 0;
  }

  // Poems methods
  async getPoems(userId: string): Promise<Poem[]> {
    return await db
      .select()
      .from(poems)
      .where(eq(poems.userId, userId))
      .orderBy(desc(poems.updatedAt));
  }

  async getPoem(id: string, userId: string): Promise<Poem | undefined> {
    const [poem] = await db
      .select()
      .from(poems)
      .where(eq(poems.id, id) && eq(poems.userId, userId));
    return poem;
  }

  async createPoem(insertPoem: InsertPoem, userId: string): Promise<Poem> {
    const [poem] = await db
      .insert(poems)
      .values({ ...insertPoem, userId })
      .returning();
    return poem;
  }

  async updatePoem(id: string, userId: string, updateData: Partial<InsertPoem>): Promise<Poem | undefined> {
    const [poem] = await db
      .update(poems)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(poems.id, id) && eq(poems.userId, userId))
      .returning();
    return poem;
  }

  async deletePoem(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(poems)
      .where(eq(poems.id, id) && eq(poems.userId, userId));
    return (result.rowCount ?? 0) > 0;
  }

  // Chat Messages methods
  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(insertMessage: InsertChatMessage, userId: string): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values({ ...insertMessage, userId })
      .returning();
    return message;
  }

  async clearChatHistory(userId: string): Promise<boolean> {
    await db
      .delete(chatMessages)
      .where(eq(chatMessages.userId, userId));
    return true;
  }
}

export const storage = new DatabaseStorage();
