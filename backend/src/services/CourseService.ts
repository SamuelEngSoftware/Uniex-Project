import { CourseRepository } from "../repositories/CourseRepository";
import { UserRepository } from "../repositories/UserRepository";
import { UserRole } from "../entities/User";

export class CourseService {

  async create(userId: string, courseData: any) {
    const user = await UserRepository.findOneBy({ id: userId });
    
    if (!user) throw new Error("Usuário não encontrado.");
    if (user.role === "participante") throw new Error("Apenas coordenadores podem criar cursos.");

    const course = CourseRepository.create({
      ...courseData,
      coordenador: user
    });

    await CourseRepository.save(course);
    return course;
  }

  async list(page: number, limit: number, search?: string) {
    const [courses, total] = await CourseRepository.listAll(page, limit, search);
    return { courses, total };
  }

  async listMyCourses(userId: string, page: number, limit: number) {
    const user = await UserRepository.findOneBy({ id: userId });
    if (!user) throw new Error("Usuário não encontrado");

    const isAdmin = user.role === UserRole.ADMIN || user.email === 'admin@uniex.com';

    const [courses, total] = await CourseRepository.findForDashboard(userId, isAdmin, page, limit);

    return { courses, total };
  }

  async update(id: string, userId: string, updateData: any) {
    const course = await CourseRepository.findOne({
      where: { id },
      relations: ["coordenador"]
    });

    if (!course) throw new Error("Curso não encontrado.");

    const user = await UserRepository.findOneBy({ id: userId });
    const isOwner = course.coordenador.id === userId;
    const isAdmin = user?.role === UserRole.ADMIN || user?.email === 'admin@uniex.com';

    if (!isOwner && !isAdmin) {
      throw new Error("Você não tem permissão para editar este curso.");
    }

    CourseRepository.merge(course, updateData);
    await CourseRepository.save(course);
    
    return course;
  }

  async delete(id: string, userId: string) {
    const course = await CourseRepository.findOne({
      where: { id },
      relations: ["coordenador"]
    });

    if (!course) throw new Error("Curso não encontrado.");

    const user = await UserRepository.findOneBy({ id: userId });

    const isOwner = course.coordenador.id === userId;
    const isAdmin = user?.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new Error("Você não tem permissão para excluir este curso.");
    }

    await CourseRepository.remove(course);
    return { message: "Curso excluído com sucesso." };
  }
}