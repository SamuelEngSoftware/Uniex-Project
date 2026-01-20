import { Request, Response } from "express";
import { SubscriptionService } from "../services/SubscriptionService";

export class SubscriptionController {

  async create(req: Request, res: Response) {
    try {
      const { courseId } = req.body;
      const userId = req.user.id;

      const subscriptionService = new SubscriptionService();
      
      const subscription = await subscriptionService.create(userId, courseId);

      return res.status(201).json({ 
        message: "Inscrição realizada com sucesso!", 
        subscription 
      });

    } catch (error: any) {
      if (error.message === "Curso não encontrado") {
        return res.status(404).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }

  async listMyCourses(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      
      const subscriptionService = new SubscriptionService();
      const mySubscriptions = await subscriptionService.listMySubscriptions(userId);

      return res.json(mySubscriptions);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar inscrições" });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params; 
      const userId = req.user.id; 

      const subscriptionService = new SubscriptionService();
      
      await subscriptionService.delete(id, userId);

      return res.status(204).send(); 
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
