import { z } from "zod/v4";

import { baseInputRequiredTextField, passwordSchema } from "./utils";

export const registerFormSchema = z
  .object({
    userName: baseInputRequiredTextField(),
    email: baseInputRequiredTextField(z.email()),
    password: baseInputRequiredTextField(passwordSchema),
    confirmPassword: baseInputRequiredTextField(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  })
  .transform(({ confirmPassword, ...restInput }) => restInput);

export type RegisterInput = z.infer<typeof registerFormSchema>;

export const loginFormSchema = z.object({
  email: baseInputRequiredTextField(z.email()),
  password: baseInputRequiredTextField(),
});

export type LoginInput = z.infer<typeof loginFormSchema>;
