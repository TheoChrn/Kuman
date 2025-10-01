import * as Ariakit from "@ariakit/react";
import { roleLabelFrench } from "@kuman/db/enums";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { PiArrowArcLeft, PiArrowLeft, PiArrowLeftBold } from "react-icons/pi";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_navigationLayout/_authLayout/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const matches = useMatches();
  const router = useRouter();
  const location = useLocation();

  const { data: user } = useSuspenseQuery(
    trpc.user.getCurrentUser.queryOptions()
  );

  return (
    <div id="profile">
      <header id="profile-header">
        {Route.fullPath !== location.pathname && (
          <Link to="/profile">
            <PiArrowLeftBold size={40} />
          </Link>
        )}
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
      </header>
      <Outlet />
    </div>
  );
}
