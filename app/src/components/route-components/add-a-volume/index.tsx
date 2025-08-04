import * as Ariakit from "@ariakit/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { PiUploadBold } from "react-icons/pi";
import { SelectItem } from "~/components/ui/inputs/select/select";
import { useAppForm } from "~/hooks/form-composition";
import { useTRPC } from "~/trpc/react";
import styles from "./styles.module.scss";
import { createVolumeForm } from "@kuman/shared/validators";

export function AddATomeRouteComponent() {
  const trpc = useTRPC();

  const { data: mangas } = useSuspenseQuery(trpc.mangas.getAll.queryOptions());

  const slugToTitle = Object.fromEntries(
    mangas.map((manga) => [manga.slug, manga.title])
  );

  const createMutation = useMutation(trpc.volumes.create.mutationOptions());

  const form = useAppForm({
    defaultValues: {
      title: "",
      volumeNumber: "",
      releaseDate: "",
      pageCount: "",
      chapterCount: "",
      summary: "",
      cover: null as File | null,
      mangaSlug: "",
    },
    validators: {
      onChange: createVolumeForm,
    },
    onSubmit: async ({ value }) => {
      const { cover, ...restValue } = value;
      const formData = new FormData();

      formData.append("cover", cover ?? "");
      formData.append("json", JSON.stringify(restValue));

      createMutation.mutate(formData);
    },
  });

  return (
    <Ariakit.HeadingLevel>
      <div className={styles["add-a-volume"]}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Ariakit.Heading>Ajouter un nouveau volume</Ariakit.Heading>
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
                name="mangaSlug"
                children={(field) => {
                  return (
                    <field.SelectInput
                      label="Série"
                      selectProps={{
                        disabled: mangas.length === 0,
                        className: styles["select"],
                        value:
                          slugToTitle[field.state.value] ||
                          "Selectionnez un statut",
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
                  return (
                    <field.TextInput type="number" label="Nombre de pages" />
                  );
                }}
              />
              <form.AppField
                name="chapterCount"
                children={(field) => {
                  return (
                    <field.TextInput
                      type="number"
                      label="Nombre de chapitres"
                    />
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
