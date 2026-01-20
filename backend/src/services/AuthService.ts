import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  
  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new Error("E-mail ou senha inválidos");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("E-mail ou senha inválidos");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string, 
      { expiresIn: "1d" }
    );

    // @ts-ignore
    delete user.password;

    return { user, token };
  }
}