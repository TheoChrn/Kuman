import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "~/components/route-components/add-a-manga/add-a-manga";

export const Route = createFileRoute("/_navigationLayout/_authLayout/admin/add-a-serie")({
  component: RouteComponent,
});
