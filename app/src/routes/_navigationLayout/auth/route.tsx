import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_navigationLayout/auth")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/catalogue" });
    }
  },
});
