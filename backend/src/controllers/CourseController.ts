import { Request, Response } from "express";
import { CourseService } from "../services/CourseService";

export class CourseController {

  async create(req: Request, res: Response) {
    try {
      const { title, description, date, spots } = req.body;
      const userId = req.user.id;

      const courseService = new CourseService(); 
      
      const course = await courseService.create(userId, { title, description, date, spots });

      return res.status(201).json(course);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = (req.query.search as string) || "";

      const courseService = new CourseService();
      const { courses, total } = await courseService.list(page, limit, search);

      const totalPages = Math.ceil(total / limit);

      return res.json({
        data: courses,
        count: total,
        page,
        totalPages
      });
    } catch (error: any) {
      return res.status(500).json({ message: "Erro ao listar cursos" });
    }
  }
}