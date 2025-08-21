import * as Ariakit from "@ariakit/react";
import { loginFormSchema } from "@kuman/shared/validators";
import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useAppForm } from "~/hooks/form-composition";
import { useTRPC } from "~/trpc/react";
import { User } from "lucia";

export const Route = createFileRoute("/_navigationLayout/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const trpc = useTRPC();
  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: async (user) => {
        console.log(user);
        queryClient.clear();
        queryClient.setQueryData(
          trpc.user.getCurrentUser.queryKey(),
          user as User
        );
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
      email: "",
      password: "",
    },
    validationLogic: revalidateLogic({
      mode: "blur",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: loginFormSchema,
    },

    onSubmit: async ({ value }) => {
      loginMutation.mutate(value);
    },
  });

  return (
    <Ariakit.HeadingLevel>
      <div id="login">
        <Ariakit.Heading>Connexion</Ariakit.Heading>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div>
            <form.AppField name="email">
              {(field) => <field.TextInput label="Email" type="email" />}
            </form.AppField>
            <form.AppField name="password">
              {(field) => <field.PasswordInput label="Mot de passe" />}
            </form.AppField>
          </div>

          <form.Subscribe selector={(state) => [state.errors]}>
            {([errorMap]) => {
              if (typeof errorMap?.[0] !== "string") return null;

              return <div className="error-block">{errorMap[0]}</div>;
            }}
          </form.Subscribe>

          <button type="submit" className="button button-primary">
            Se connecter
          </button>
        </form>
        <p>
          Vous n'avez pas de compte ? <br />
          <Link to="/auth/register">Inscrivez-vous !</Link>
        </p>
      </div>
    </Ariakit.HeadingLevel>
  );
}
