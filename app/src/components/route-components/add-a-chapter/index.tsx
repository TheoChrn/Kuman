import * as Ariakit from "@ariakit/react";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { PiUploadBold } from "react-icons/pi";
import { useAppForm } from "~/hooks/form-composition";
import { useTRPC } from "~/trpc/react";
import styles from "./styles.module.scss";
import { createChapterForm } from "@kuman/shared/validators";
import { SelectItem } from "~/components/ui/inputs/select/select";
import { useStore } from "@tanstack/react-store";

export function AddAChapterRouteComponent() {
  const trpc = useTRPC();

  const createChapterMutation = useMutation(
    trpc.chapters.create.mutationOptions()
  );

  const { data: mangas } = useSuspenseQuery(trpc.mangas.getAll.queryOptions());

  const form = useAppForm({
    defaultValues: {
      name: "",
      chapterNumber: "",
      volumeId: "",
      mangaSlug: "",
      pageCount: "",
      releaseDate: "",
      images: [] as File[],
    },
    validators: {
      onChange: createChapterForm,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const { images, ...restValue } = value;
      const formData = new FormData();
      images.forEach((image) => formData.append("images", image));
      formData.append(
        "json",
        JSON.stringify({
          ...restValue,
          volumeNumber: volumes!.find((volume) => volume.id === value.volumeId)!
            .volumeNumber,
        })
      );

      createChapterMutation.mutate(formData);
    },
  });

  const [mangaSlug] = useStore(form.store, (state) => [state.values.mangaSlug]);

  const { data: volumes } = useQuery(
    trpc.volumes.getAllBySerie.queryOptions(
      { mangaSlug: mangaSlug! },
      { enabled: !!mangaSlug }
    )
  );

  return (
    <div className={styles["add-a-chapter"]}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Ariakit.Heading>Ajouter un nouveau chapitre</Ariakit.Heading>
        <div className={`${styles["container"]}`}>
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
          <div className={styles["fields"]}>
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
                      className: styles["select"],
                      value:
                        mangas.find((manga) => manga.slug === field.state.value)
                          ?.title ?? "Selectionnez une série",
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
              name="volumeId"
              children={(field) => {
                return (
                  <field.SelectInput
                    label="Série"
                    selectProps={{
                      disabled: !mangaSlug,
                      className: styles["select"],
                      value: mangaSlug
                        ? volumes?.find(
                            (volume) => volume.id === field.state.value
                          )?.volumeNumber ?? "Selectionnez un volume"
                        : "Une série doit être sélectionnée",
                    }}
                  >
                    {volumes?.map((volume) => (
                      <SelectItem key={volume.id} value={volume.id}>
                        {volume.volumeNumber}
                      </SelectItem>
                    ))}
                  </field.SelectInput>
                );
              }}
            />
          </div>
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div>
              <button
                type="submit"
                disabled={!canSubmit}
                className={`${styles["button"]} ${styles["button-primary"]} ${styles["button-full"]}`}
              >
                {isSubmitting ? "..." : "Créer"}
              </button>
            </div>
          )}
        />
      </form>
    </div>
  );
}
