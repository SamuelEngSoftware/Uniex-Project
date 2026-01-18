import { AppDataSource } from "../config/data-source";
import { Course } from "../entities/Course";
import { User } from "../entities/User";
import { Like } from "typeorm";

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
}