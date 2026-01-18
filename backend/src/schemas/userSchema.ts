import { z } from "zod";

export const userSchema = z.object({
  body: z.object({
    name: z.string({ message: "Nome é obrigatório" }),
    email: z
      .string({ message: "Email é obrigatório" })
      .email("Formato de e-mail inválido"),
    password: z
      .string({ message: "Senha é obrigatória" })
      .min(6, "A senha deve ter no mínimo 6 caracteres"),
    role: z.enum(["participante", "coordenador"], {
      message: "O tipo deve ser 'participante' ou 'coordenador'"
    }),
  }),
});