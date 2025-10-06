import * as Ariakit from "@ariakit/react";
import { RouterOutputs } from "@kuman/api";
import {
  createOrUpdateVolume,
  createOrUpdateVolumeForm,
} from "@kuman/shared/validators";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { PiUploadBold } from "react-icons/pi";
import { Button } from "~/components/ui/buttons/button";
import { SelectItem } from "~/components/ui/inputs/select/select";
import { useAppForm } from "~/hooks/form-composition";
import { useTRPC } from "~/trpc/react";

export function VolumeForm(props: {
  volume?: RouterOutputs["volumes"]["get"];
}) {
  const trpc = useTRPC();

  const { data: mangas } = useSuspenseQuery(trpc.mangas.getAll.queryOptions());

  const slugToTitle = Object.fromEntries(
    mangas.map((manga) => [manga.slug, manga.title])
  );

  const navigate = useNavigate();

  const createMutation = useMutation(
    trpc.volumes.create.mutationOptions({
      onMutate: async (_variables, context) => {
        const variables = createOrUpdateVolume.parse(_variables);

        await context.client.cancelQueries(
          trpc.chapters.getAllFromSerieGrouppedByVolume.queryOptions({
            serie: variables.mangaSlug,
          })
        );

        const initialVolumes = context.client.getQueryData(
          trpc.chapters.getAllFromSerieGrouppedByVolume.queryKey()
        );

        context.client.setQueryData(
          trpc.chapters.getAllFromSerieGrouppedByVolume.queryKey(),
          [
            ...(initialVolumes ?? []),
            {
              coverImageUrl: variables.cover
                ? URL.createObjectURL(variables.cover)
                : null,
              summary: variables.summary,
              title: variables.title,
              volumeNumber: variables.volumeNumber,
              chapters: [],
            },
          ]
        );

        return { initialVolumes };
      },
      onSuccess: () => form.reset(),
      onError: (_, __, results, context) =>
        context.client.setQueryData(
          trpc.chapters.getAllFromSerieGrouppedByVolume.queryKey(),
          results?.initialVolumes
        ),
      onSettled: (_, __, ___, ____, context) =>
        context.client.invalidateQueries(
          trpc.chapters.getAllFromSerieGrouppedByVolume.queryFilter()
        ),
    })
  );

  const updateMutation = useMutation(
    trpc.volumes.update.mutationOptions({
      onMutate: async (_variables, context) => {
        const variables = createOrUpdateVolume.parse(_variables);

        await context.client.cancelQueries(
          trpc.chapters.getAllFromSerieGrouppedByVolume.queryOptions({
            serie: variables.mangaSlug,
          })
        );

        const initialVolumes = context.client.getQueryData(
          trpc.chapters.getAllFromSerieGrouppedByVolume.queryKey({
            serie: variables.mangaSlug,
          })
        );

        context.client.setQueryData(
          trpc.chapters.getAllFromSerieGrouppedByVolume.queryKey(),
          initialVolumes!.map((volume) =>
            volume.volumeNumber === variables.volumeNumber
              ? {
                  coverImageUrl: variables.cover
                    ? URL.createObjectURL(variables.cover)
                    : null,
                  summary: variables.summary,
                  title: variables.title,
                  volumeNumber: variables.volumeNumber,
                  chapters:
                    initialVolumes!.find(
                      (v) => v.volumeNumber === props.volume?.volumeNumber
                    )?.chapters ?? [],
                }
              : volume
          )
        );

        return { initialVolumes };
      },
      onSuccess: (_, __, ___, context) => {
        navigate({ to: "/admin/series" });
        context.client.invalidateQueries(
          trpc.volumes.get.queryFilter({
            serieSlug: props.volume!.serieSlug,
            volume: props.volume!.volumeNumber,
          })
        );
      },
      onError: (_, __, results, context) => {
        context.client.setQueryData(
          trpc.chapters.getAllFromSerieGrouppedByVolume.queryKey(),
          results?.initialVolumes
        );
      },
      onSettled: (_, __, ___, ____, context) =>
        context.client.invalidateQueries(
          trpc.chapters.getAllFromSerieGrouppedByVolume.queryFilter()
        ),
    })
  );

  const form = useAppForm({
    defaultValues: {
      title: props.volume?.title ?? "",
      volumeNumber: props.volume?.volumeNumber.toString() ?? "",
      releaseDate: props.volume?.releaseDate ?? "",
      pageCount: props.volume?.pageCount?.toString() ?? "",
      chapterCount: props.volume?.chapterCount?.toString() ?? "",
      summary: props.volume?.summary ?? "",
      cover: null as File | null,
      mangaSlug: props.volume?.serieSlug ?? "",
    },
    validators: {
      onChange: createOrUpdateVolumeForm,
    },
    onSubmit: async ({ value }) => {
      const { cover, ...restValue } = value;
      const formData = new FormData();

      if (cover) {
        formData.append("cover", cover);
      }

      formData.append("json", JSON.stringify(restValue));

      props.volume
        ? updateMutation.mutate(formData)
        : createMutation.mutate(formData);
    },
  });

  const imagePreview = useStore(form.store, (state) => {
    if (state.values.cover && state.values.cover.size > 0) {
      return URL.createObjectURL(state.values.cover!);
    }
    return props.volume?.coverImageUrl ?? null;
  });

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
        <form.AppField
          name="cover"
          children={(field) => {
            return (
              <field.FileInput
                imagePreview={imagePreview}
                label={
                  <>
                    <PiUploadBold size={32} />
                    Cliquez ou glissez une image
                  </>
                }
              />
            );
          }}
        />

        <div className="fields">
          <form.AppField
            name="title"
            children={(field) => {
              return <field.TextInput label="Titre" />;
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
                    value: slugToTitle[field.state.value],
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
                <field.TextInput
                  type="number"
                  min={1}
                  label="Numéro du volume"
                />
              );
            }}
          />

          <form.AppField
            name="pageCount"
            children={(field) => {
              return <field.TextInput type="number" label="Nombre de pages" />;
            }}
          />
          <form.AppField
            name="chapterCount"
            children={(field) => {
              return (
                <field.TextInput type="number" label="Nombre de chapitres" />
              );
            }}
          />

          <form.AppField
            name="releaseDate"
            children={(field) => {
              return <field.TextInput type="date" label="Date de sortie" />;
            }}
          />

          <form.AppField
            name="summary"
            children={(field) => {
              return <field.TextareaInput label="Synopsis" />;
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
                {isSubmitting ? "..." : "Enregistrer"}
              </Button>
            </div>
          )}
        />
      </form>
    </Ariakit.HeadingLevel>
  );
}
