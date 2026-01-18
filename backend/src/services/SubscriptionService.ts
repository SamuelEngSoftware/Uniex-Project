import { AppDataSource } from "../config/data-source";
import { Subscription } from "../entities/Subscription";
import { Course } from "../entities/Course";

export class SubscriptionService {
  private subscriptionRepo = AppDataSource.getRepository(Subscription);
  private courseRepo = AppDataSource.getRepository(Course);

  async create(userId: string, courseId: string) {
    const course = await this.courseRepo.findOneBy({ id: courseId });
    if (!course) {
      throw new Error("Curso não encontrado");
    }
    const alreadySubscribed = await this.subscriptionRepo.findOneBy({
      courseId,
      userId
    });

    if (alreadySubscribed) {
      throw new Error("Você já está inscrito neste curso!");
    }

    const totalSubs = await this.subscriptionRepo.countBy({ courseId });
    if (totalSubs >= course.spots) {
      throw new Error("Ops! As vagas para este curso acabaram.");
    }

    const subscription = this.subscriptionRepo.create({
      userId,
      courseId
    });

    await this.subscriptionRepo.save(subscription);
    return subscription;
  }

  async listMySubscriptions(userId: string) {
    return await this.subscriptionRepo.find({
      where: { userId },
      relations: ["course"]
    });
  }
}