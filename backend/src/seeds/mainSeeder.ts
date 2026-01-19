import { AppDataSource } from "../config/data-source";
import { User, UserRole } from "../entities/User";
import { Course } from "../entities/Course";
import { Subscription } from "../entities/Subscription";
import bcrypt from "bcryptjs";

const runSeeder = async () => {
  try {
    await AppDataSource.initialize();
    await AppDataSource.synchronize(true); 

    const userRepo = AppDataSource.getRepository(User);
    const courseRepo = AppDataSource.getRepository(Course);
    const subRepo = AppDataSource.getRepository(Subscription);

    const password = await bcrypt.hash("123456", 8);

    const admin = userRepo.create({ 
      name: "Admin", 
      email: "admin@uniex.com", 
      password, 
      role: UserRole.ADMIN 
    });

    const coord = userRepo.create({ 
      name: "Prof. Renato", 
      email: "renato@uniex.com", 
      password, 
      role: UserRole.COORDENADOR 
    });

    await userRepo.save([admin, coord]);

    const alunosData = Array.from({ length: 10 }).map((_, i) => ({
      name: `Aluno Teste ${i + 1}`,
      email: `aluno${i + 1}@uniex.com`,
      password,
      role: UserRole.PARTICIPANTE 
    }));
    
    const alunos = await userRepo.save(userRepo.create(alunosData));

    const coursesData = [];
    for (let i = 1; i <= 40; i++) {
      coursesData.push({
        title: `Curso de Tecnologia Módulo ${i}`,
        description: `Domine a tecnologia ${i} com projetos práticos e desafios reais.`,
        date: i % 2 === 0 ? "2025-05-10" : "2025-08-20",
        spots: 20 + i, 
        coordenador: i % 2 === 0 ? admin : coord, 
      });
    }
    const courses = await courseRepo.save(courseRepo.create(coursesData));

    const subsData = [];
   
    for (let i = 0; i < 5; i++) {
      subsData.push({ userId: alunos[0].id, courseId: courses[i].id });
    }
    await subRepo.save(subRepo.create(subsData));

    console.log(`Seed Finalizado!`);
    console.log(`Dados gerados:`);
    console.log(`1 Admin: admin@uniex.com`);
    console.log(`1 Coordenador: renato@uniex.com`);
    console.log(`${alunos.length} Alunos (senha 123456)`);
    console.log(`${courses.length} Cursos criados`);

  } catch (error) {
    console.error("Erro no seed:", error);
  } finally {
    await AppDataSource.destroy();
  }
};

runSeeder();