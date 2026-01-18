import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {

  async create(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      const userService = new UserService();
      
      const user = await userService.create({ name, email, password, role });

      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}