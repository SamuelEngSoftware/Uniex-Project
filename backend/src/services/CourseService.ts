import { AppDataSource } from "../config/data-source";
import { Course } from "../entities/Course";
import { User, UserRole } from "../entities/User";
import { Like, FindManyOptions } from "typeorm";

export class CourseService {
  private courseRepository = AppDataSource.getRepository(Course);
  private userRepository = AppDataSource.getRepository(User);

  async create(userId: string, courseData: { title: string, description: string, date: string, spots: number }) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    if (user.role === "participante") {
      throw new Error("Apenas coordenadores podem criar cursos.");
    }

    const course = this.courseRepository.create({
      ...courseData,
      coordenador: user
    });

    await this.courseRepository.save(course);
    return course;
  }

  async list(page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;

    const [courses, total] = await this.courseRepository.findAndCount({
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

    return { courses, total };
  }

  async listDashboard(userId: string, page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error("Usuário não encontrado");

    const isAdmin = user.role === UserRole.ADMIN || user.email === 'admin@uniex.com';

    const queryOptions: FindManyOptions<Course> = {
      where: {
        title: Like(`%${search}%`)
      },
      take: limit,
      skip,
      order: { created_at: "DESC" },
      relations: ["coordenador"]
    };

    if (isAdmin) {
      queryOptions.relations = [
        "coordenador",
        "subscriptions",
        "subscriptions.user"
      ];
    } else {
      queryOptions.where = {
        title: Like(`%${search}%`),
        coordenador: { id: userId }
      };
    }

    const [courses, total] = await this.courseRepository.findAndCount(queryOptions);

    return { courses, total };
  }

  async update(id: string, userId: string, updateData: { title?: string, description?: string, date?: string, spots?: number }) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ["coordenador"]
    });

    if (!course) throw new Error("Curso não encontrado.");

    const user = await this.userRepository.findOneBy({ id: userId });
    const isOwner = course.coordenador.id === userId;
    const isAdmin = user?.role === UserRole.ADMIN || user?.email === 'admin@uniex.com';

    if (!isOwner && !isAdmin) {
      throw new Error("Você não tem permissão para editar este curso.");
    }

    this.courseRepository.merge(course, updateData);
    await this.courseRepository.save(course);
    
    return course;
  }

  async delete(id: string, userId: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ["coordenador"]
    });

    if (!course) throw new Error("Curso não encontrado.");

    const user = await this.userRepository.findOneBy({ id: userId });

    const isOwner = course.coordenador.id === userId;
    const isAdmin = user?.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new Error("Você não tem permissão para excluir este curso.");
    }

    await this.courseRepository.remove(course);
    return { message: "Curso excluído com sucesso." };
  }
}