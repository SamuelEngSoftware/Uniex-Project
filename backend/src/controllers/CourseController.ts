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

  async listMyCourses(req: Request, res: Response) {
    try {
      const userId = req.user.id;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = (req.query.search as string) || "";

      const courseService = new CourseService();
      const { courses, total } = await courseService.listDashboard(userId, page, limit, search);

      const totalPages = Math.ceil(total / limit);

      return res.json({
        data: courses,
        count: total,
        page,
        totalPages
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Erro ao buscar cursos do painel" });
    }
  }
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params; 
      const { title, description, date, spots } = req.body; 
      const userId = req.user.id; 

      const courseService = new CourseService();
      
      const course = await courseService.update(id, userId, { title, description, date, spots });

      return res.json(course);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const courseService = new CourseService();
      
      await courseService.delete(id, userId);

      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}