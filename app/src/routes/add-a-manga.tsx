import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "~/components/route-components/add-a-manga/add-a-manga";

export const Route = createFileRoute("/add-a-manga")({
  component: RouteComponent,
});
