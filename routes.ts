import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { sendContactEmail } from "./emailService";
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
  try {
    const validatedData = insertContactMessageSchema.parse(req.body);
    // Сохраняем в storage (mock-база)
    const message = await storage.insertContactMessage(validatedData);
    
    // Отправляем письмо на почту
    await sendContactEmail(
      validatedData.name,
      validatedData.email || "не указан",
      validatedData.message || ""
    );
    
    res.json({ 
      success: true, 
      message: "Сообщение успешно отправлено",
      id: message.id 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false, 
        message: "Неверные данные формы",
        errors: error.errors 
      });
    } else {
      console.error("Error saving contact message:", error);
      res.status(500).json({ 
        success: false, 
        message: "Ошибка при отправке сообщения" 
      });
    }
  }
});

  // Get all contact messages (admin endpoint)
  app.get("/api/contact/messages", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json({ success: true, messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ 
        success: false, 
        message: "Ошибка при получении сообщений" 
      });
    }
  });

  return httpServer;
}
