import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  Router,
  useLoaderData,
  useLoaderDeps,
  useMatch,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import {
  PiBinocularsBold,
  PiHouseBold,
  PiSignOutBold,
  PiUser,
} from "react-icons/pi";
import { Button } from "~/components/ui/buttons/button";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_navigationLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  const isCurrentRouteProtected = !!useMatch({
    from: "/_navigationLayout/_protectedLayout",
    shouldThrow: false,
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { isAuth } = useLoaderData({ from: "__root__" });

  const navigate = useNavigate();
  const router = useRouter();
  const logoutMutation = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess: async () => {
        queryClient.clear();
        router.invalidate();
        if (isCurrentRouteProtected) {
          navigate({ to: "/auth/login" });
        }
      },
    })
  );

  return (
    <>
      <Outlet />
      <nav className="mobile-nav">
        <Link to="/" activeProps={{ className: "active" }}>
          <PiHouseBold size={24} />
          Accueil
        </Link>
        {isAuth ? (
          <Button onClick={() => logoutMutation.mutate()}>
            <PiSignOutBold size={24} />
            Logout
          </Button>
        ) : (
          <Link to="/auth/login">
            <PiUser size={24} />
            Connexion
          </Link>
        )}
        <Link to="/catalogue" activeProps={{ className: "active" }}>
          <PiBinocularsBold size={24} />
          Explorer
        </Link>
      </nav>
    </>
  );
}
