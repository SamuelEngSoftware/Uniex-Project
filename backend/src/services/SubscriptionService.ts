import { SubscriptionRepository } from "../repositories/SubscriptionRepository";
import { CourseRepository } from "../repositories/CourseRepository";

export class SubscriptionService {
  
  async create(userId: string, courseId: string) {
    const course = await CourseRepository.findOneBy({ id: courseId });
    if (!course) throw new Error("Curso não encontrado");
    const isSubscribed = await SubscriptionRepository.isUserSubscribed(userId, courseId);
    if (isSubscribed) throw new Error("Você já está inscrito neste curso!");

    const totalSubs = await SubscriptionRepository.countBy({ courseId });
    if (totalSubs >= course.spots) throw new Error("Ops! As vagas para este curso acabaram.");

    const subscription = SubscriptionRepository.create({ userId, courseId });
    await SubscriptionRepository.save(subscription);
    
    return subscription;
  }

  async listMySubscriptions(userId: string) {
    return await SubscriptionRepository.find({
      where: { userId },
      relations: ["course"]
    });
  }
  
  async delete(subscriptionId: string, userId: string) {
      const subscription = await SubscriptionRepository.findSubscriptionWithUser(subscriptionId);

      if (!subscription) throw new Error("Inscrição não encontrada.");
    
      if (subscription.user.id !== userId) throw new Error("Você não tem permissão para cancelar esta inscrição.");

      await SubscriptionRepository.remove(subscription);
      return { message: "Inscrição cancelada com sucesso." };
  }
}