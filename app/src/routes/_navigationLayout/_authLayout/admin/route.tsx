import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_navigationLayout/_authLayout/admin")({
  beforeLoad: ({ context: { user } }) => {
    if (user!.role !== "administrator") {
      throw redirect({ to: "/" });
    }
  },
});
