import { createFileRoute } from "@tanstack/react-router";
import { AddAChapterRouteComponent } from "~/components/route-components/add-a-chapter";

export const Route = createFileRoute("/add-a-chapter")({
  component: AddAChapterRouteComponent,
});
