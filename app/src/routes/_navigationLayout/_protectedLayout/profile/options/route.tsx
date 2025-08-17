import * as Ariakit from "@ariakit/react";
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { PiArrowLeftBold } from "react-icons/pi";

export const Route = createFileRoute(
  "/_navigationLayout/_protectedLayout/profile/options"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();

  return (
    <div id="options">
      <header>
        <Link to=".." from={location.pathname as any}>
          <PiArrowLeftBold size={24} />
          <Ariakit.VisuallyHidden>Retour</Ariakit.VisuallyHidden>
        </Link>
      </header>
      <Outlet />
    </div>
  );
}
