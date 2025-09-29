import * as Ariakit from "@ariakit/react";
import { role } from "@kuman/db/enums";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { MdAdminPanelSettings } from "react-icons/md";
import {
  PiBookBookmarkBold,
  PiCrownCrossBold,
  PiPencil,
  PiSignOutBold,
  PiTrash,
} from "react-icons/pi";
import { Button } from "~/components/ui/buttons/button";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_navigationLayout/_authLayout/profile/")(
  {
    component: RouteComponent,
  }
);

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
    <Ariakit.HeadingLevel>
      <div className="menus">
        <Ariakit.HeadingLevel>
          <section>
            <Ariakit.Heading className="heading">Général</Ariakit.Heading>
            <nav className="general-nav">
              {user!.role !== role.ADMINISTRATOR &&
              user!.role !== role.MODERATOR ? (
                <Link to="/profile/abonnement">
                  <PiCrownCrossBold size={24} />
                  Gérer mon abonnement
                </Link>
              ) : (
                <Link to="/admin">
                  <MdAdminPanelSettings size={24} /> Panneau d'administration
                </Link>
              )}

              <div>
                <Link to="/profile/account">
                  <PiPencil size={24} /> Modifier mes informations
                </Link>
                <Link to="/bookmarks">
                  <PiBookBookmarkBold size={24} /> Ma librairie
                </Link>
              </div>
            </nav>
          </section>
        </Ariakit.HeadingLevel>
        <Ariakit.HeadingLevel>
          <section>
            <Ariakit.Heading className="heading">Autre</Ariakit.Heading>
            <nav className="other-nav">
              <Button className="button-full">
                <PiTrash size={24} />
                Supprimer mon compte
              </Button>
              <Button
                className="button-full"
                onClick={() => logoutMutation.mutate()}
              >
                <PiSignOutBold size={24} />
                Se déconnecter
              </Button>
            </nav>
          </section>
        </Ariakit.HeadingLevel>
      </div>
    </Ariakit.HeadingLevel>
  );
}
