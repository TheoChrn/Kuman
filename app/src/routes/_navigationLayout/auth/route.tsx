import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_navigationLayout/auth")({
  beforeLoad: ({ context }) => {
    if (context.isAuth) {
      throw redirect({ to: "/catalogue" });
    }
  },
});
