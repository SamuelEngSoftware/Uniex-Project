import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

export const UserRepository = AppDataSource.getRepository(User).extend({
  async findByEmail(email: string) {
    return this.findOneBy({ email });
  },
  
  async exists(email: string): Promise<boolean> {
    const count = await this.countBy({ email });
    return count > 0;
  }
});