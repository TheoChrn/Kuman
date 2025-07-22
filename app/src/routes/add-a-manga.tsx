import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "~/trpc/react";
import styles from "~/components/pages/add-a-manga/styles.module.scss";

export const Route = createFileRoute("/add-a-manga")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const createChapterMutation = useMutation(
    trpc.mangas.create.mutationOptions({
      onMutate: (variables) => console.log(variables),
    })
  );

  // const { supabase } = Route.useRouteContext();

  const form = useForm({
    defaultValues: {
      name: "",
      nChapters: "",
      slug: "",
      chapters: [] as File[],
    },
    onSubmit: async ({ value }) => {
      console.log(value);

      // const files = value.chapters.map((file) => ({
      //   path: `mangas/${value.slug}/tome-1/chapter-${value.nChapters}/${file.}`,
      // }));

      // await Promise.all([
      //   await supabase.storage
      //     .from("assets")
      //     .upload("manga/avatar1.png", avatarFile, {
      //       cacheControl: "3600",
      //       upsert: false,
      //     }),
      // ]);

      createChapterMutation.mutate(value);
    },
  });

  console.log(createChapterMutation.error);

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
            name="nChapters"
            children={(field) => {
              return (
                <>
                  <label htmlFor={field.name}>nChapters</label>
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
            name="chapters"
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
