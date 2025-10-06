import { RouterOutputs } from "@kuman/api";
import { generateMangaId } from "@kuman/shared/generate-ids";
import {
  Genre,
  genreValues,
  publisherFrLabelFrench,
  publisherFrValues,
  publisherJpLabelFrench,
  publisherJpValues,
  Status,
  statusLabelFrench,
  statusValues,
  Type,
  typeValues,
} from "@kuman/db/enums";
import {
  createOrUpdateSerie,
  createOrUpdateSerieForm,
} from "@kuman/shared/validators";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTRPC } from "~/trpc/react";
import { toSlug } from "@kuman/shared/format";
import { useAppForm } from "~/hooks/form-composition";
import { SelectItem } from "~/components/ui/inputs/select/select";
import * as Ariakit from "@ariakit/react";
import { useStore } from "@tanstack/react-store";
import { useEffect } from "react";
import { PiUploadBold } from "react-icons/pi";
import { Button } from "~/components/ui/buttons/button";

export function AddSerieFormModal(props: {
  serie?: RouterOutputs["mangas"]["get"];
}) {
  const trpc = useTRPC();

  const navigate = useNavigate();

  const createMutation = useMutation(
    trpc.mangas.create.mutationOptions({
      onMutate: async (_variables, context) => {
        const variables = createOrUpdateSerie.parse(_variables);

        await context.client.cancelQueries(trpc.mangas.getAll.queryOptions());

        const initialSeries = context.client.getQueryData(
          trpc.mangas.getAll.queryKey()
        );

        context.client.setQueryData(trpc.mangas.getAll.queryKey(), [
          ...(initialSeries ?? []),
          {
            author: variables.author,
            id: variables.id,
            slug: variables.slug,
            genres: variables.genres as Genre[],
            status: variables.status as Status,
            title: variables.title,
            type: variables.type as Type,
            coverUrl: variables.cover
              ? URL.createObjectURL(variables.cover)
              : null,
          },
        ]);

        return { initialSeries };
      },
      onSuccess: () => form.reset(),
      onError: (_, __, results, context) =>
        context.client.setQueryData(
          trpc.mangas.getAll.queryKey(),
          results?.initialSeries
        ),
      onSettled: (_, __, ___, ____, context) =>
        context.client.invalidateQueries(trpc.mangas.getAll.queryFilter()),
    })
  );

  const updateMutation = useMutation(
    trpc.mangas.update.mutationOptions({
      onMutate: async (_variables, context) => {
        const variables = createOrUpdateSerie.parse(_variables);

        await context.client.cancelQueries(
          trpc.mangas.get.queryOptions({ slug: variables.slug })
        );

        const initialSeries = context.client.getQueryData(
          trpc.mangas.getAll.queryKey()
        );

        context.client.setQueryData(
          trpc.mangas.getAll.queryKey(),
          initialSeries?.map((serie) =>
            serie.slug === variables.slug
              ? {
                  ...serie,
                  author: variables.author,
                  slug: variables.slug,
                  genres: variables.genres as Genre[],
                  status: variables.status as Status,
                  title: variables.title,
                  type: variables.type as Type,
                  coverUrl: variables.cover
                    ? URL.createObjectURL(variables.cover)
                    : null,
                }
              : serie
          )
        );

        return { initialSeries };
      },
      onSuccess: () => navigate({ to: "/admin/series" }),
      onError: (_, __, results, context) =>
        context.client.setQueryData(
          trpc.mangas.getAll.queryKey(),
          results?.initialSeries
        ),
      onSettled: (_, __, ___, ____, context) =>
        context.client.invalidateQueries(trpc.mangas.getAll.queryFilter()),
    })
  );

  const form = useAppForm({
    defaultValues: {
      title: props.serie?.title ?? "",
      originalTitle: props.serie?.originalTitle ?? "",
      romajiTitle: props.serie?.romajiTitle ?? "",
      alternativeTitles: props.serie?.alternativeTitles ?? [],
      author: props.serie?.author ?? "",
      synopsis: props.serie?.synopsis ?? "",
      cover: null as File | null,
      tomeCount: props.serie?.tomeCount.toString() ?? "",
      status: props.serie?.status.toString() ?? "",
      type: props.serie?.type.toString() ?? "",
      genres: props.serie?.genres?.map((genre) => genre.toString()) ?? [],
      releaseDate: props.serie?.releaseDate ?? "",
      publisherJp: props.serie?.publisherJp.toString() ?? "",
      publisherFr: props.serie?.publisherFr.toString() ?? "",
    },
    validators: {
      onChange: createOrUpdateSerieForm,
    },
    onSubmit: async ({ value }) => {
      const { cover, ...restValue } = value;
      const formData = new FormData();

      if (cover) {
        formData.append("cover", cover);
      }

      formData.append(
        "json",
        JSON.stringify({
          ...restValue,
          id: props.serie?.id ?? generateMangaId(),
          slug: props.serie?.slug ?? toSlug(value.romajiTitle),
        })
      );

      props.serie
        ? updateMutation.mutate(formData)
        : createMutation.mutate(formData);
    },
  });

  const imagePreview = useStore(form.store, (state) => {
    if (state.values.cover && state.values.cover.size > 0) {
      return URL.createObjectURL(state.values.cover!);
    }
    return props.serie?.coverUrl ?? null;
  });

  useEffect(() => {
    if (props.serie?.coverUrl) {
      fetch(props.serie.coverUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File(
            [blob],
            props.serie!.coverUrl?.split("/").pop()!,
            {
              type: blob.type,
            }
          );
          form.setFieldValue("cover", file);
        });
    }
  }, []);

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
            name="originalTitle"
            children={(field) => {
              return <field.TextInput label="Titre Original" />;
            }}
          />
          <form.AppField
            name="romajiTitle"
            children={(field) => {
              return <field.TextInput label="Titre Romaji" />;
            }}
          />
          <form.AppField
            mode="array"
            name="alternativeTitles"
            children={(field) => {
              return (
                <field.TextInput
                  label="Titre Alternatifs"
                  onChange={(e) => {
                    field.handleChange([e.target.value]);
                  }}
                />
              );
            }}
          />
          <form.AppField
            name="author"
            children={(field) => {
              return <field.TextInput label="Auteur" />;
            }}
          />
          <form.AppField
            name="tomeCount"
            children={(field) => {
              return (
                <field.TextInput min={1} type="number" label="Nombre de tome" />
              );
            }}
          />
          <form.AppField
            name="synopsis"
            children={(field) => {
              return <field.TextareaInput label="Synopsis" />;
            }}
          />

          <form.AppField
            name="status"
            children={(field) => {
              return (
                <field.SelectInput
                  label="Statut"
                  selectProps={{
                    className: "select",
                    fallback: "Selectionnez le statut",
                    value:
                      statusLabelFrench[
                        field.state.value as keyof typeof statusLabelFrench
                      ],
                  }}
                >
                  {statusValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {
                        statusLabelFrench[
                          value as keyof typeof statusLabelFrench
                        ]
                      }
                    </SelectItem>
                  ))}
                </field.SelectInput>
              );
            }}
          />
          <form.AppField
            name="type"
            children={(field) => {
              return (
                <field.SelectInput
                  label="Type"
                  selectProps={{
                    className: "select",
                    fallback: "Selectionnez le type",
                  }}
                >
                  {typeValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </field.SelectInput>
              );
            }}
          />
          <form.AppField
            name="genres"
            children={(field) => {
              return (
                <field.MultiSelectInput
                  label="Genres"
                  renderSelection={
                    field.state.value.length ? (
                      <div className="render-multi-selection">
                        {field.state.value.length === 1
                          ? field.state.value[0]
                          : `${field.state.value.length} genres sélectionnés`}
                      </div>
                    ) : (
                      "Sélectionnez un ou plusieurs genres"
                    )
                  }
                >
                  {genreValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                      <Ariakit.SelectItemCheck />
                    </SelectItem>
                  ))}
                </field.MultiSelectInput>
              );
            }}
          />
          <form.AppField
            name="releaseDate"
            children={(field) => {
              return (
                <field.TextInput type="date" label="Date de publication" />
              );
            }}
          />
          <form.AppField
            name="publisherFr"
            children={(field) => {
              return (
                <field.SelectInput
                  label="Éditeur français"
                  selectPopoverProps={{
                    modal: true,
                    portal: true,
                    preventBodyScroll: true,
                  }}
                  selectProps={{
                    className: "select",
                    fallback: "Selectionnez un éditeur français",
                    value:
                      publisherFrLabelFrench[
                        field.state.value as keyof typeof publisherFrLabelFrench
                      ],
                  }}
                >
                  {publisherFrValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {
                        publisherFrLabelFrench[
                          value as keyof typeof publisherFrLabelFrench
                        ]
                      }
                    </SelectItem>
                  ))}
                </field.SelectInput>
              );
            }}
          />
          <form.AppField
            name="publisherJp"
            children={(field) => {
              return (
                <field.SelectInput
                  label="Éditeur original"
                  selectPopoverProps={{
                    portal: true,
                    preventBodyScroll: true,
                  }}
                  selectProps={{
                    className: "select",
                    fallback: "Selectionnez un éditeur original",
                    value:
                      publisherJpLabelFrench[
                        field.state.value as keyof typeof publisherJpLabelFrench
                      ],
                  }}
                >
                  {publisherJpValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {
                        publisherJpLabelFrench[
                          value as keyof typeof publisherJpLabelFrench
                        ]
                      }
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
                {isSubmitting ? "..." : "Enregistrer"}
              </Button>
            </div>
          )}
        />
      </form>
    </Ariakit.HeadingLevel>
  );
}
