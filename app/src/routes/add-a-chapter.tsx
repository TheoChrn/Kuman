import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "~/trpc/react";
import styles from "~/components/pages/add-a-manga/styles.module.scss";
import { supabase } from "~/utils/supabase.client";

export const Route = createFileRoute("/add-a-chapter")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();

  const getUrlsMutation = useMutation(trpc.chapters.getUrls.mutationOptions());

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      chapterNumber: "",
      tomeNumber: "",
      images: [] as File[],
    },
    onSubmit: async ({ value }) => {
      const paths = value.images.map(
        (file) =>
          `mangas/${value.slug}/tome-1/chapter-${value.images.length}/${file.name}`
      );

      const res = await getUrlsMutation.mutateAsync({ paths });

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
          <form.Field
            name="name"
            children={(field) => {
              return (
                <>
                  <label htmlFor={field.name}>Name</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid ? (
                    <em>{field.state.meta.errors.join(",")}</em>
                  ) : null}
                  {field.state.meta.isValidating ? "Validating..." : null}
                </>
              );
            }}
          />
          <form.Field
            name="slug"
            children={(field) => {
              return (
                <>
                  <label htmlFor={field.name}>Slug</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid ? (
                    <em>{field.state.meta.errors.join(",")}</em>
                  ) : null}
                  {field.state.meta.isValidating ? "Validating..." : null}
                </>
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
