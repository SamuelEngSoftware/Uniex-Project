import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Course } from "../entities/Course";
import { User } from "../entities/User";
import { Like } from "typeorm";

export class CourseController {

  async create(req: Request, res: Response) {
    console.log("Chegou na rota de criar curso");

    const { title, description, date, spots } = req.body;
    
    const userId = req.user.id; 

    const userRepository = AppDataSource.getRepository(User);
    const courseRepository = AppDataSource.getRepository(Course);

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "Usuário sumiu do banco? Não encontrado." });
    }

    if (user.role === "participante") {
      console.log("Tentativa de criação por participante bloqueada");
      return res.status(403).json({ message: "Sem permissão. Fale com a coordenação." });
    }

    const course = courseRepository.create({
      title,
      description,
      date,
      spots,
      coordenador: user 
    });

    await courseRepository.save(course);

    console.log("Curso criado com sucesso:", course.title);
    return res.status(201).json(course);
  }

  async list(req: Request, res: Response) {
    const courseRepository = AppDataSource.getRepository(Course);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const [courses, total] = await courseRepository.findAndCount({
      where: {
        title: Like(`%${search}%`) 
      },
      relations: ["coordenador"], 
      select: {
        coordenador: {
          id: true,
          name: true,
          email: true 
        }
      },
      take: limit, 
      skip: skip,  
      order: {
        created_at: "DESC" 
      }
    });

    const totalPages = Math.ceil(total / limit);

    return res.json({
      data: courses,
      count: total,
      page,
      totalPages
    });
  }
}