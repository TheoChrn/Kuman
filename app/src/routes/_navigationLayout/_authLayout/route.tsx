import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_navigationLayout/_authLayout")({
  beforeLoad: ({ context: { user } }) => {
    if (!user) {
      throw redirect({ to: "/auth/login" });
    }
  },
});
