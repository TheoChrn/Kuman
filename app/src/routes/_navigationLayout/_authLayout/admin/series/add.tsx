import { createFileRoute } from "@tanstack/react-router";
import { Dialog, DialogHeading } from "~/components/ui/dialog";
import { AddSerieFormModal } from "~/components/serie-form";
import * as Ariakit from "@ariakit/react";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/admin/series/add"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Dialog backUrl="/admin/series">
      <Ariakit.HeadingLevel>
        <div id="serie-form" className="form-wrapper">
          <DialogHeading>Ajouter une nouvelle série</DialogHeading>
          <AddSerieFormModal />
        </div>
      </Ariakit.HeadingLevel>
    </Dialog>
  );
}
