import { z } from "zod";

export const subscriptionSchema = z.object({
  body: z.object({
    courseId: z.string({ message: "O ID do curso é obrigatório" }),
  }),
});