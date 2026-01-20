import { AppDataSource } from "../config/data-source";
import { Subscription } from "../entities/Subscription";

export const SubscriptionRepository = AppDataSource.getRepository(Subscription).extend({
  async isUserSubscribed(userId: string, courseId: string): Promise<boolean> {
    const count = await this.countBy({ userId, courseId });
    return count > 0;
  },

  async findSubscriptionWithUser(subscriptionId: string) {
    return this.findOne({
      where: { id: subscriptionId },
      relations: ["user"] 
    });
  }
});