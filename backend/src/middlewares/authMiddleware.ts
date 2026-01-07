import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export function authMiddleware(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  const { authorization } = req.headers;


  if (!authorization) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const [, token] = authorization.split(" ");

  try {
    const decoded = jwt.verify(token, "uma_chave_super_secreta_do_uniex");
    
    const { id, role } = decoded as TokenPayload;

    req.user = { id, role };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}