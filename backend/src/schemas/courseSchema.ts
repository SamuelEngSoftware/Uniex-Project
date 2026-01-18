import { z } from "zod";

export const courseSchema = z.object({
  body: z.object({
    title: z.string({ message: "Título é obrigatório" }),
    description: z.string({ message: "Descrição é obrigatória" }),
    date: z.string({ message: "Data é obrigatória" }), 
    spots: z
      .number({ message: "Número de vagas é obrigatório" })
      .int()
      .positive("O número de vagas deve ser positivo"),
  }),
});