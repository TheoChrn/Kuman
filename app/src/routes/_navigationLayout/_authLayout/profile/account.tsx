import { updateUserFormSchema } from "@kuman/shared/validators";
import { revalidateLogic } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "~/components/ui/buttons/button";
import { useAppForm } from "~/hooks/form-composition";
import { useTRPC } from "~/trpc/react";
import { seo } from "~/utils/seo";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/profile/account"
)({
  head: () => ({
    meta: [
      ...seo({
        title: "Kuman | Mon Compte",
      }),
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();

  const router = useRouter();

  const { data: user } = useSuspenseQuery(
    trpc.user.getCurrentUser.queryOptions()
  );
  const updateUserMutation = useMutation(
    trpc.user.updatePersonalData.mutationOptions({
      onMutate: async (_variables, context) => {
        await context.client.cancelQueries(
          trpc.user.getCurrentUser.queryOptions()
        );

        const { currentPassword, password, ...variables } = _variables;

        const userOldData = context.client.getQueryData(
          trpc.user.getCurrentUser.queryKey()
        );

        context.client.setQueryData(trpc.user.getCurrentUser.queryKey(), {
          ...userOldData!,
          ...variables,
        });

        return { userOldData };
      },
      onSuccess: (_, __, ___, context) => {
        form.reset();
        router.invalidate();
        context.client.invalidateQueries(trpc.comments.getAll.queryFilter());
      },
      onError: (error, _, results, context) => {
        context.client.setQueryData(
          trpc.user.getCurrentUser.queryKey(),
          () => results?.userOldData
        );
        form.setErrorMap({
          onDynamic: {
            form: error.message,
            fields: {},
          },
        });
      },
      onSettled: (_, __, ___, ____, context) => {
        context.client.invalidateQueries(trpc.user.getCurrentUser.pathFilter());
      },
    })
  );

  const form = useAppForm({
    defaultValues: {
      userName: user!.userName,
      firstName: user!.firstName ?? "",
      lastName: user!.lastName ?? "",
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationLogic: revalidateLogic({
      mode: "blur",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: updateUserFormSchema,
    },

    onSubmit: async ({ value }) => {
      updateUserMutation.mutate(value);
    },
  });

  return (
    <div id="account">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <div className="user-names">
            <form.AppField name="firstName">
              {(field) => <field.TextInput label="Prénom" />}
            </form.AppField>
            <form.AppField name="lastName">
              {(field) => <field.TextInput label="Nom" />}
            </form.AppField>
          </div>
          <form.AppField name="userName">
            {(field) => <field.TextInput label="Pseudo" />}
          </form.AppField>
          <form.AppField name="currentPassword">
            {(field) => <field.PasswordInput label="Ancien mot de passe" />}
          </form.AppField>
          <form.AppField name="password">
            {(field) => <field.PasswordInput label="Nouveau mot de passe" />}
          </form.AppField>
          <form.AppField name="confirmPassword">
            {(field) => (
              <field.PasswordInput label="Confirmez le nouveau mot de passe" />
            )}
          </form.AppField>
        </div>

        <form.Subscribe selector={(state) => [state.errors]}>
          {([errorMap]) => {
            if (typeof errorMap?.[0] !== "string") return null;

            return <div className="error-block">{errorMap[0]}</div>;
          }}
        </form.Subscribe>

        <form.Subscribe selector={(state) => [state.canSubmit]}>
          {([canSubmit]) => (
            <div>
              <Button
                type="submit"
                disabled={!canSubmit}
                className="button button-primary"
              >
                Enregistrer
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
