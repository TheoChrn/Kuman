import { createFileRoute } from "@tanstack/react-router";
import { Dialog, DialogHeading } from "~/components/ui/dialog";
import * as Ariakit from "@ariakit/react";
import { VolumeForm } from "~/components/volume-form";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/admin/series/$serieSlug/volume/add"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Dialog backUrl="/admin/series">
      <Ariakit.HeadingLevel>
        <div id="volume-form" className="form-wrapper">
          <DialogHeading>Ajouter un volume</DialogHeading>
          <VolumeForm />
        </div>
      </Ariakit.HeadingLevel>
    </Dialog>
  );
}
