import { createFileRoute, Link } from "@tanstack/react-router";
import * as Ariakit from "@ariakit/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { PiMagnifyingGlassBold } from "react-icons/pi";

export const Route = createFileRoute(
  "/_navigationLayout/_protectedLayout/bookmarks/"
)({
  component: RouteComponent,
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.ensureQueryData(trpc.bookmarks.getMany.queryOptions());
  },
});

function RouteComponent() {
  const trpc = useTRPC();
  const { data: bookmarks } = useSuspenseQuery(
    trpc.bookmarks.getMany.queryOptions()
  );

  if (!bookmarks.length) {
    return (
      <Ariakit.HeadingLevel>
        <Ariakit.VisuallyHidden>
          <Ariakit.Heading>Bookmarks</Ariakit.Heading>
        </Ariakit.VisuallyHidden>
        <div id="bookmarks">
          <p>Vous n'avez pas encore commencer de série.</p>
          <Link to="/catalogue" className="button button-primary">
            <PiMagnifyingGlassBold /> Explorez le catalogue
          </Link>
        </div>
      </Ariakit.HeadingLevel>
    );
  }

  return (
    <Ariakit.HeadingLevel>
      <div id="bookmarks">
        <Ariakit.Heading>Bookmarks</Ariakit.Heading>
      </div>
    </Ariakit.HeadingLevel>
  );
}
