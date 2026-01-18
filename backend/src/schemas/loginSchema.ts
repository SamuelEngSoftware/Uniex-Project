import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Email é obrigatório" })
      .email("E-mail inválido"),
    password: z.string({ message: "Senha é obrigatória" }),
  }),
});