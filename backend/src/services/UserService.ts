import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcryptjs";

export class UserService {

  async create(userData: any) {
    const { name, email, password, role } = userData;
    const userExists = await UserRepository.exists(email);

    if (userExists) {
      throw new Error("E-mail já cadastrado!");
    }
    const passwordHash = await bcrypt.hash(password, 8);
    const user = UserRepository.create({
      name,
      email,
      password: passwordHash,
      role
    });

    await UserRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
}