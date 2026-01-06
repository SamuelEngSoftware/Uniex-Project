import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(401).json({ message: "E-mail ou senha inválidos" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "E-mail ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      "uma_chave_super_secreta_do_uniex", 
      { expiresIn: "1d" }
    );

    // @ts-ignore
    delete user.password; 
    
    return res.json({
      user,
      token
    });
  }
}