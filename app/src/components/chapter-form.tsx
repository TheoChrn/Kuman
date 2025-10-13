import { RouterOutputs } from "@kuman/api";
import {
  createOrUpdateChapterForm,
  ImageSchema,
} from "@kuman/shared/validators";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { PiUploadBold } from "react-icons/pi";
import { Button } from "~/components/ui/buttons/button";
import { SelectItem } from "~/components/ui/inputs/select/select";
import { useAppForm } from "~/hooks/form-composition";
import { useTRPC } from "~/trpc/react";
import * as Ariakit from "@ariakit/react";

export function ChapterForm(props: {
  chapter?: RouterOutputs["chapters"]["getChapterAdminProcedure"];
  serieSlug: string;
}) {
  const navigate = useNavigate();
  const trpc = useTRPC();
  const createChapterMutation = useMutation(
    trpc.chapters.create.mutationOptions({
      onSuccess: () => navigate({ to: "/admin/series" }),
      onSettled: (_, __, ___, _____, context) =>
        context.client.invalidateQueries(
          trpc.chapters.getAllFromSerieGrouppedByVolume.pathFilter()
        ),
    })
  );
  const updateChapterMutation = useMutation(
    trpc.chapters.update.mutationOptions({
      onSuccess: () => navigate({ to: "/admin/series" }),
      onSettled: (_, __, ___, _____, context) =>
        context.client.invalidateQueries(
          trpc.chapters.getAllFromSerieGrouppedByVolume.pathFilter()
        ),
    })
  );

  const { data: mangas } = useSuspenseQuery(trpc.mangas.getAll.queryOptions());

  const { data: volumes } = useSuspenseQuery(
    trpc.volumes.getAllBySerie.queryOptions({ mangaSlug: props.serieSlug })
  );

  const form = useAppForm({
    defaultValues: {
      name: props.chapter?.name ?? "",
      chapterNumber: props.chapter?.number?.toString() ?? "",
      volumeNumber: props.chapter?.volumeNumber?.toString() ?? "",
      mangaSlug: props.chapter?.serieSlug ?? "",
      pageCount: props.chapter?.pageCount?.toString() ?? "",
      releaseDate: props.chapter?.releaseDate ?? "",
      images: (props.chapter?.pages as ImageSchema[]) ?? [],
    },
    validators: {
      onChange: createOrUpdateChapterForm,
    },
    onSubmit: async ({ value }) => {
      const { images, ...restValue } = value;
      const formData = new FormData();
      for (const image of images) {
        if (!image.file) continue;
        formData.append("images", image.file);
      }

      formData.append(
        "json",
        JSON.stringify({
          ...restValue,
          volumeNumber: value.volumeNumber,
          ...(!!images.length && {
            metaData: images.map((img) => ({
              status: img.status,
              path: img.path,
            })),
          }),
          ...(props.chapter?.id && { id: props.chapter.id }),
        })
      );

      console.log("toto");
      props.chapter
        ? updateChapterMutation.mutate(formData)
        : createChapterMutation.mutate(formData);
    },
  });

  const [mangaSlug] = useStore(form.store, (state) => [state.values.mangaSlug]);

  return (
    <Ariakit.HeadingLevel>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="dialog-content"
      >
        <div>
          <form.AppField
            mode="array"
            name="images"
            children={(field) => {
              return (
                <field.MultiFileInput
                  label={
                    <>
                      <PiUploadBold size={32} />
                      Cliquez ou glissez des images
                    </>
                  }
                />
              );
            }}
          />
        </div>
        <div className="fields">
          <form.AppField
            name="name"
            children={(field) => <field.TextInput label="Nom du chapitre" />}
          />
          <form.AppField
            name="pageCount"
            children={(field) => (
              <field.TextInput type="number" label="Nombre de pages" />
            )}
          />
          <form.AppField
            name="chapterNumber"
            children={(field) => (
              <field.TextInput type="number" label="Numéro de chapitre" />
            )}
          />

          <form.AppField
            name="releaseDate"
            children={(field) => {
              return <field.TextInput type="date" label="Date de sortie" />;
            }}
          />

          <form.AppField
            name="mangaSlug"
            children={(field) => {
              return (
                <field.SelectInput
                  label="Série"
                  selectProps={{
                    disabled: mangas.length === 0,
                    className: "select",
                    fallback: "Selectionnez une série",
                    value: mangas.find(
                      (manga) => manga.slug === field.state.value
                    )?.title,
                  }}
                >
                  {mangas.map((value) => (
                    <SelectItem key={value.slug} value={value.slug}>
                      {value.title}
                    </SelectItem>
                  ))}
                </field.SelectInput>
              );
            }}
          />

          <form.AppField
            name="volumeNumber"
            children={(field) => {
              return (
                <field.SelectInput
                  label="Volume"
                  selectProps={{
                    disabled: !mangaSlug,
                    className: "select",
                    fallback: mangaSlug
                      ? "Selectionnez un volume"
                      : "Une série doit être sélectionnée",
                    value: field.state.value,
                  }}
                >
                  {volumes?.map((volume) => (
                    <SelectItem
                      key={volume.id}
                      value={volume.volumeNumber.toString()}
                    >
                      {volume.volumeNumber}
                    </SelectItem>
                  ))}
                </field.SelectInput>
              );
            }}
          />
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div className="button-container">
              <Button
                type="submit"
                disabled={!canSubmit}
                className="button button-primary button-full"
              >
                {isSubmitting
                  ? "..."
                  : props.chapter?.id
                    ? "Enregistrer"
                    : "Créer"}
              </Button>
            </div>
          )}
        />
      </form>
    </Ariakit.HeadingLevel>
  );
}
