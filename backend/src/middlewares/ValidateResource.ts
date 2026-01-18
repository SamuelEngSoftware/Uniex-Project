import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validateResource = (schema: ZodType) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    next();
    
  } catch (e: any) {
    if (e instanceof ZodError) {
      return res.status(400).json({
        message: e.issues[0].message 
      });
    }
    return res.status(400).json({ message: "Erro de validação interna." });
  }
};