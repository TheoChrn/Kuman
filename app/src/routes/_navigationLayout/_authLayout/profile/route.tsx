import * as Ariakit from "@ariakit/react";
import { role, roleLabelFrench } from "@kuman/db/enums";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { PiSignOutBold } from "react-icons/pi";
import { Button } from "~/components/ui/buttons/button";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_navigationLayout/_authLayout/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: user } = useSuspenseQuery(
    trpc.user.getCurrentUser.queryOptions()
  );
  const router = useRouter();
  const navigate = useNavigate();

  const logoutMutation = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess: async () => {
        queryClient.clear();
        router.invalidate();
        navigate({ to: "/auth/login" });
      },
    })
  );
  return (
    <div id="profile">
      <Ariakit.HeadingLevel>
        <aside className="menus">
          <Ariakit.HeadingLevel>
            <section>
              <Ariakit.Heading className="heading">Général</Ariakit.Heading>
              <menu>
                {(user!.role === role.ADMINISTRATOR ||
                  user!.role === role.MODERATOR) && (
                  <Link className="button button-neutral" to="/admin">
                    Panneau d'administration
                  </Link>
                )}
                <Link className="button button-neutral" to="/profile/account">
                  Modifier mes informations
                </Link>
                {user!.role !== role.ADMINISTRATOR &&
                  user!.role !== role.MODERATOR && (
                    <Link
                      to="/profile/abonnement"
                      className="button button-neutral"
                    >
                      Gérer mes abonnements
                    </Link>
                  )}
              </menu>
            </section>
          </Ariakit.HeadingLevel>
          <Ariakit.HeadingLevel>
            <section>
              <Ariakit.Heading className="heading">Sécurité</Ariakit.Heading>
              <menu>
                <Link className="button button-neutral" to=".">
                  Changer de mot de passe
                </Link>
              </menu>
            </section>
          </Ariakit.HeadingLevel>
          <Ariakit.HeadingLevel>
            <section>
              <Ariakit.Heading className="heading">Autre</Ariakit.Heading>
              <menu>
                <Button
                  className="button button-neutral"
                  onClick={() => logoutMutation.mutate()}
                >
                  <PiSignOutBold size={24} />
                  Se déconnecter
                </Button>
                <Button className="button button-neutral">
                  <PiSignOutBold size={24} />
                  Supprimer mon compte
                </Button>
              </menu>
            </section>
          </Ariakit.HeadingLevel>
        </aside>
      </Ariakit.HeadingLevel>
      <main>
        <div className="user-info">
          <img
            src="/mock_profile.png"
            alt="Photo de profil"
            height={50}
            width={50}
          />
          <div>
            <Ariakit.Heading>{user!.userName}</Ariakit.Heading>
            <span>{roleLabelFrench[user!.role]}</span>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
