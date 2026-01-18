import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async login(email: string, password: string) {
    
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new Error("E-mail ou senha inválidos");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("E-mail ou senha inválidos");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "uma_chave_super_secreta_do_uniex", 
      { expiresIn: "1d" }
    );

    // @ts-ignore
    delete user.password;

    return { user, token };
  }
}