import { createFileRoute, Link } from "@tanstack/react-router";
import { PiGearDuotone } from "react-icons/pi";
import { Button } from "~/components/ui/buttons/button";
import * as Ariakit from "@ariakit/react";

export const Route = createFileRoute(
  "/_navigationLayout/_protectedLayout/profile/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div id="profile">
      <header>
        <Link to="/profile/options">
          <PiGearDuotone size={24} />
          <Ariakit.VisuallyHidden>Options</Ariakit.VisuallyHidden>
        </Link>
      </header>
    </div>
  );
}
