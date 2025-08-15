import { z } from "zod/v4";

import { baseInputRequiredTextField } from "./utils";

export const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'"\\|,.<>/?]).{12,128}$/,
    "Le mot de passe doit contenir au moins 12 caractères, avec au moins une majuscule, une minuscule, un chiffre et un caractère spécial.",
  );

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
