import { z } from "zod/v4";

import {
  baseInputRequiredTextField,
  baseInputTextField,
  optionalInputTextField,
  passwordSchema,
} from "./utils";

export const updateUserFormSchema = z
  .object({
    userName: baseInputRequiredTextField(),
    firstName: baseInputTextField(),
    lastName: baseInputTextField(),
    currentPassword: optionalInputTextField(passwordSchema.optional()),
    password: optionalInputTextField(passwordSchema.optional()),
    confirmPassword: optionalInputTextField(),
  })
  .check((ctx) => {
    const { currentPassword, password, confirmPassword } = ctx.value;

    if (currentPassword || password || confirmPassword) {
      if (!currentPassword) {
        ctx.issues.push({
          code: "custom",
          path: ["currentPassword"],
          message: "Veuillez saisir votre mot de passe actuel",
          input: currentPassword,
        });
      }
      if (!password) {
        ctx.issues.push({
          code: "custom",
          path: ["password"],
          message: "Veuillez saisir un nouveau mot de passe",
          input: password,
        });
      }
      if (!confirmPassword) {
        ctx.issues.push({
          code: "custom",
          path: ["confirmPassword"],
          message: "Veuillez confirmer le nouveau mot de passe",
          input: confirmPassword,
        });
      }

      if (password && confirmPassword && password !== confirmPassword) {
        ctx.issues.push({
          code: "custom",
          path: ["confirmPassword"],
          message: "Les mots de passe ne correspondent pas",
          input: confirmPassword,
        });
      }
    }
  });
export const updateUserSchema = updateUserFormSchema.omit({
  confirmPassword: true,
});
