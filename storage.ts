import * as schema from "@shared/schema";
import type { InsertContactMessage, ContactMessage } from "@shared/schema";

// Временно отключаем реальную базу данных — используем mock для локальной разработки
console.log("⚠️  Database connection skipped - using mock storage for development");

export interface IStorage {
  insertContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
}

class MockStorage implements IStorage {
  private messages: ContactMessage[] = [];
  private nextId = 1;   // простой счётчик для id

  async insertContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    // Преобразуем id в string, чтобы соответствовать типу
    const newMessage: ContactMessage = {
      id: this.nextId.toString(),           // <-- исправлено: делаем string
      ...message,
      createdAt: new Date(),
    };

    this.messages.push(newMessage);
    this.nextId++;

    console.log("✅ Сообщение из формы сохранено (в памяти):", newMessage);
    return newMessage;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return [...this.messages].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

// Экспортируем mock вместо реальной базы
export const storage: IStorage = new MockStorage();
