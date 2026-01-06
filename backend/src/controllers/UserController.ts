import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

export class UserController {

  async create(req: Request, res: Response) {
    const { name, email, password, role } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    const userExists = await userRepository.findOneBy({ email });

    if (userExists) {
      return res.status(400).json({ message: "E-mail já cadastrado!" });
    }

    const passwordHash = await bcrypt.hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: passwordHash, 
      role 
    });

    await userRepository.save(user);

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  }
}