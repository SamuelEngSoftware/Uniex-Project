import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Subscription } from "../entities/Subscription";
import { Course } from "../entities/Course";

export class SubscriptionController {

  async create(req: Request, res: Response) {
    const { courseId } = req.body;
    const userId = req.user.id; 

    const subscriptionRepo = AppDataSource.getRepository(Subscription);
    const courseRepo = AppDataSource.getRepository(Course);

    const course = await courseRepo.findOneBy({ id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Curso não encontrado" });
    }

    const alreadySubscribed = await subscriptionRepo.findOneBy({
      courseId,
      userId
    });

    if (alreadySubscribed) {
      return res.status(400).json({ message: "Você já está inscrito neste curso!" });
    }

    const totalSubs = await subscriptionRepo.countBy({ courseId });

    if (totalSubs >= course.spots) {
      return res.status(400).json({ message: "Ops! As vagas para este curso acabaram." });
    }

    const subscription = subscriptionRepo.create({
      userId,
      courseId
    });

    await subscriptionRepo.save(subscription);

    return res.status(201).json({ message: "Inscrição realizada com sucesso!", subscription });
  }

  async listMyCourses(req: Request, res: Response) {
    const userId = req.user.id;
    const subscriptionRepo = AppDataSource.getRepository(Subscription);

    const mySubscriptions = await subscriptionRepo.find({
      where: { userId },
      relations: ["course"] 
    });

    return res.json(mySubscriptions);
  }
}