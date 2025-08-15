import { registerFormSchema } from "@kuman/shared/validators";
import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { useAppForm } from "~/hooks/form-composition";
import { useTRPC } from "~/trpc/react";
import * as Ariakit from "@ariakit/react";

export const Route = createFileRoute("/_navigationLayout/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const [registerError, setRegisterError] = useState<string | null>(null);
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const trpc = useTRPC();
  const registerMutation = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: async (userId) => {
        queryClient.setQueryData(trpc.user.getCurrentUser.queryKey(), userId);
        router.invalidate();
        navigate({ to: "/catalogue" });
      },
      onError: (error) => {
        form.setErrorMap({
          onDynamic: {
            form: error.message,
            fields: {},
          },
        });
      },
    })
  );

  const form = useAppForm({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationLogic: revalidateLogic({
      mode: "blur",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: registerFormSchema,
    },

    onSubmit: async ({ value }) => {
      if (registerError) setRegisterError(null);
      registerMutation.mutate(value);
    },
  });

  return (
    <Ariakit.HeadingLevel>
      <div id="register">
        <Ariakit.Heading>Inscription</Ariakit.Heading>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div>
            <form.AppField name="userName">
              {(field) => <field.TextInput label="Pseudo" />}
            </form.AppField>
            <form.AppField name="email">
              {(field) => <field.TextInput label="Email" type="email" />}
            </form.AppField>
            <form.AppField name="password">
              {(field) => <field.PasswordInput label="Mot de passe" />}
            </form.AppField>
            <form.AppField name="confirmPassword">
              {(field) => (
                <field.PasswordInput label="Confirmez le mot de passe" />
              )}
            </form.AppField>
          </div>

          <form.Subscribe selector={(state) => [state.errors]}>
            {([errorMap]) => {
              if (typeof errorMap?.[0] !== "string") return null;

              return <div className="error-block">{errorMap[0]}</div>;
            }}
          </form.Subscribe>
          {registerError && <div className="error-block">{registerError}</div>}

          <button type="submit" className="button button-primary">
            S'inscrire
          </button>
        </form>
        <p>
          Vous avez déjà un compte ? <br />
          <Link to="/auth/login">Connectez-vous !</Link>
        </p>
      </div>
    </Ariakit.HeadingLevel>
  );
}
