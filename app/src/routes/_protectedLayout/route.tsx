import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protectedLayout")({
  beforeLoad: ({ context }) => {
    if (!context.isAuth) {
      throw redirect({ to: "/auth/login" });
    }
  },
});
