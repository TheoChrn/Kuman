import * as Ariakit from "@ariakit/react";
import {
  genreValues,
  publisherFrLabelFrench,
  publisherFrValues,
  publisherJpLabelFrench,
  publisherJpValues,
  statusLabelFrench,
  statusValues,
  typeValues,
} from "@kuman/db/enums";
import { createMangaForm } from "@kuman/shared/validators";
import { useMutation } from "@tanstack/react-query";
import { PiUploadBold } from "react-icons/pi";
import { SelectItem } from "~/components/ui/inputs/select/select";
import { useAppForm } from "~/hooks/form-composition";
import { useTRPC } from "~/trpc/react";

import styles from "./styles.module.scss";

export function RouteComponent() {
  const trpc = useTRPC();

  const createMutation = useMutation(trpc.mangas.create.mutationOptions());

  const form = useAppForm({
    defaultValues: {
      title: "",
      originalTitle: "",
      romajiTitle: "",
      alternativeTitles: [] as string[],
      author: "",
      synopsis: "",
      cover: {} as File,
      tomeCount: "",
      status: "",
      type: "",
      genres: [] as string[],
      releaseDate: "",
      publisherJp: "",
      publisherFr: "",
    },
    validators: {
      onChange: createMangaForm,
    },
    onSubmit: async ({ value }) => {
      const { cover, ...restValue } = value;
      const formData = new FormData();
      formData.append("cover", value.cover);
      formData.append("json", JSON.stringify(restValue));

      createMutation.mutate(formData);
    },
  });

  return (
    <Ariakit.HeadingLevel>
      <div className={styles["add-a-manga"]}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Ariakit.Heading>Ajouter une nouvelle série</Ariakit.Heading>
          <div className={`${styles["container"]}`}>
            <form.AppField
              name="cover"
              children={(field) => {
                return (
                  <field.FileInput
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
            <div className={styles["fields"]}>
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
                    <field.TextInput
                      min={1}
                      type="number"
                      label="Nombre de tome"
                    />
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
                        className: styles["select"],
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
                        className: styles["select"],
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
                          <div className={styles["render-multi-selection"]}>
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
                        className: styles["select"],
                        fallback: "Selectionnez un éditeur français",
                        value:
                          publisherFrLabelFrench[
                            field.state
                              .value as keyof typeof publisherFrLabelFrench
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
                        className: styles["select"],
                        fallback: "Selectionnez un éditeur original",
                        value:
                          publisherJpLabelFrench[
                            field.state
                              .value as keyof typeof publisherJpLabelFrench
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
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`${styles["button"]} ${styles["button-primary"]} ${styles["button-full"]}`}
                >
                  {isSubmitting ? "..." : "Créer"}
                </button>
              )}
            />
          </div>
        </form>
      </div>
    </Ariakit.HeadingLevel>
  );
}
