import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async create(userData: any) {
    const { name, email, password, role } = userData;

    const userExists = await this.userRepository.findOneBy({ email });

    if (userExists) {
      throw new Error("E-mail já cadastrado!");
    }

    const passwordHash = await bcrypt.hash(password, 8);

    const user = this.userRepository.create({
      name,
      email,
      password: passwordHash,
      role
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
}