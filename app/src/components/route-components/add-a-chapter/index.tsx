import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { supabase } from "~/utils/supabase-client";
import styles from "./styles.module.scss";
import { useAppForm } from "~/hooks/form-composition";

export function AddAChapterRouteComponent() {
  const trpc = useTRPC();

  const createUploadSignedUrls = useMutation(
    trpc.chapters.getUrls.mutationOptions()
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      mangaSlug: "",
      chapterNumber: "",
      tomeNumber: "",
      images: [] as File[],
    },
    onSubmit: async ({ value }) => {
      const paths = value.images.map(
        (file) =>
          `mangas/${value.mangaSlug}/tome-1/chapter-${value.chapterNumber}/${file.name}`
      );

      const res = await createUploadSignedUrls.mutateAsync({ paths });

      const map = value.images.map((file, index) =>
        supabase.storage
          .from("assets")
          .uploadToSignedUrl(
            res[index]!.data!.path,
            res[index]!.data!.token,
            file,
            {
              cacheControl: "15778800",
              upsert: false,
            }
          )
      );

      const ress = await Promise.all(map);

      console.log(ress);

      // createChapterMutation.mutate(value);
    },
  });

  return (
    <div className={styles["add-a-manga"]}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.AppField
            name="name"
            children={(field) => <field.TextInput label="Nom du chapitre" />}
          />
          <form.AppField
            name="mangaSlug"
            children={(field) => {
              return (
                <field.SelectInput label="Statut">
                  {/* {statusValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {
                        statusLabelFrench[
                          value as keyof typeof statusLabelFrench
                        ]
                      }
                    </SelectItem>
                  ))} */}
                </field.SelectInput>
              );
            }}
          />
          <form.Field
            mode="array"
            name="images"
            children={(field) => {
              return (
                <>
                  <label htmlFor={field.name}>Planches</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="file"
                    multiple
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      field.handleChange(files);
                    }}
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid ? (
                    <em>{field.state.meta.errors.join(",")}</em>
                  ) : null}
                  {field.state.meta.isValidating ? "Validating..." : null}
                </>
              );
            }}
          />
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </button>
              <button
                type="reset"
                onClick={(e) => {
                  // Avoid unexpected resets of form elements (especially <select> elements)
                  e.preventDefault();
                  form.reset();
                }}
              >
                Reset
              </button>
            </>
          )}
        />
      </form>
    </div>
  );
}
