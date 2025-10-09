import * as Ariakit from "@ariakit/react";
import { RouterOutputs } from "@kuman/api";
import { Role, role, roleLabelFrench } from "@kuman/db/enums";
import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import {
  PiCaretDown,
  PiDotsThreeVerticalBold,
  PiLockKeyBold,
  PiPencil,
  PiTrash,
} from "react-icons/pi";
import { z } from "zod/v4";
import { Button } from "~/components/ui/buttons/button";
import { useAppForm } from "~/hooks/form-composition";
import { useDevice } from "~/hooks/use-device";
import { useTRPC } from "~/trpc/react";
import { nestArray } from "~/utils/format";
import { User } from "lucia";
import { seo } from "~/utils/seo";

function timeSinceDate(date: Date) {
  const diffMs = Date.now() - date.getTime();

  const secondes = Math.floor(diffMs / 1000);
  const minutes = Math.floor(secondes / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (secondes < 60)
    return `${secondes} ${secondes > 1 ? "secondes" : "seconde"} `;
  if (minutes < 60) return `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
  if (hours < 24) return `${hours} ${hours > 1 ? "heures" : "heure"}`;
  if (days < 30) return `${days} ${days > 1 ? "jours" : "jour"}`;

  const mois = Math.floor(days / 30);
  if (mois < 12) return `${mois} mois`;

  const years = Math.floor(days / 365);
  return `${years} ${years > 1 ? "ans" : "an"}`;
}

export const Route = createFileRoute(
  "/_navigationLayout/$serieSlug/_layout/avis"
)({
  head: () => ({
    meta: [
      ...seo({
        title: "Kuman | Avis",
      }),
    ],
  }),
  component: RouteComponent,
  loader: ({ context, params }) => {
    context.queryClient.prefetchQuery(
      context.trpc.comments.getAll.queryOptions({ serieSlug: params.serieSlug })
    );
  },
});

function RouteComponent() {
  const trpc = useTRPC();
  const params = Route.useParams();
  const { user } = Route.useRouteContext();

  const { device } = useDevice();

  const selectFunc = useCallback(
    (comments: RouterOutputs["comments"]["getAll"]) => {
      return {
        comments: device !== "mobile" ? nestArray(comments) : comments,
        count: comments.length,
      };
    },
    [device]
  );

  const {
    data: { comments, count },
  } = useSuspenseQuery(
    trpc.comments.getAll.queryOptions(
      { serieSlug: params.serieSlug },
      { select: selectFunc }
    )
  );

  return (
    <section id="avis" className="comments">
      <p className="heading heading-6">
        {!!count ? `(${count}) Commentaires` : "(0) Commentaire"}
      </p>
      {user ? (
        <CommentForm slug={params.serieSlug} />
      ) : (
        <div className="required-state">
          <PiLockKeyBold size={40} />
          <p className=" heading heading-5">
            Vous devez vous authentifier pour laisser un avis
          </p>
        </div>
      )}
      <ul>
        {comments.map((comment) => {
          if (comment.parentId && !("children" in comment)) {
            const parentCommentUser = comments.find(
              (c) => c.id === comment.parentId
            );

            return (
              <li key={comment.id}>
                <Comment
                  parentUser={parentCommentUser!.user}
                  user={user!}
                  comment={comment}
                  slug={params.serieSlug}
                />
              </li>
            );
          }

          return (
            <li key={comment.id}>
              <Comment user={user!} comment={comment} slug={params.serieSlug} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Comment(props: {
  user: NonNullable<User>;
  comment:
    | ReturnType<
        typeof nestArray<RouterOutputs["comments"]["getAll"][number]>
      >[number]
    | RouterOutputs["comments"]["getAll"][number];
  slug: string;
  parentUser?: {
    userName: string;
    role: Role;
  };
}) {
  const trpc = useTRPC();

  const [answerTo, setAnswerTo] = useState<string | null>(null);
  const [edit, setEdit] = useState<boolean>(false);

  const deleteComment = useMutation(
    trpc.comments.softDelete.mutationOptions({
      onSettled: (_, __, ___, ____, context) =>
        context.client.invalidateQueries(
          trpc.comments.getAll.queryFilter({ serieSlug: props.slug })
        ),
    })
  );

  return (
    <article className="comment">
      <div>
        <img
          src="/mock_profile.png"
          alt="Photo de profil"
          height={50}
          width={50}
          className="avatar"
        />
        {edit ? (
          <CommentForm
            content={props.comment.content}
            cancel={() => setEdit(false)}
            slug={props.slug}
            id={props.comment.id}
          />
        ) : (
          <div>
            <div>
              <span
                className={`comment-user-role comment-user-role-${props.comment.user.role} text-xs`}
              >
                {roleLabelFrench[props.comment.user.role!]}
              </span>
              <div className="comment-user">
                <span>{props.comment.user.userName}</span>
                {props.comment.updatedAt.getTime() !==
                  props.comment.createdAt.getTime() && "(modifié)"}
                <span>il y a {timeSinceDate(props.comment.createdAt)}</span>
              </div>
            </div>
            <p
              className={
                props.comment.deleted
                  ? `comment-content comment-content-deleted`
                  : "comment-content"
              }
            >
              {props.parentUser && <span>@{props.parentUser.userName}</span>}{" "}
              {props.comment.content}
            </p>
            <Button
              onClick={() => setAnswerTo(props.comment.id)}
              className="answer-button text-sm button button-outline"
            >
              Répondre
            </Button>
            {!!("children" in props.comment) &&
              !!props.comment.children.length && (
                <Ariakit.DisclosureProvider>
                  <Ariakit.Disclosure className="disclosure text-sm">
                    {props.comment.children.length}{" "}
                    {props.comment.children.length > 1 ? "réponses" : "réponse"}
                    <PiCaretDown className="caret" />
                  </Ariakit.Disclosure>
                  <Ariakit.DisclosureContent className="disclosure-content">
                    {props.comment.children.map((child) => (
                      <Comment
                        key={child.id}
                        user={props.user}
                        comment={child}
                        slug={props.slug}
                      />
                    ))}
                  </Ariakit.DisclosureContent>
                </Ariakit.DisclosureProvider>
              )}
            {answerTo ? (
              <CommentForm
                cancel={() => setAnswerTo(null)}
                slug={props.slug}
                parentId={answerTo}
              />
            ) : null}
          </div>
        )}
      </div>
      {(props.user?.id === props.comment.userId ||
        props.user?.role === role.ADMINISTRATOR) &&
        !props.comment.deleted && (
          <div className="actions">
            <Ariakit.PopoverProvider placement="bottom-end">
              <Ariakit.PopoverDisclosure className="button button-outline">
                <Ariakit.VisuallyHidden>
                  Options du commentaire
                </Ariakit.VisuallyHidden>
                <PiDotsThreeVerticalBold size={24} />
              </Ariakit.PopoverDisclosure>
              <Ariakit.Popover gutter={4} render={<menu />}>
                {props.user.id === props.comment.userId && (
                  <Button onClick={() => setEdit(true)} className="button">
                    <PiPencil />
                    Éditer
                  </Button>
                )}
                <Button
                  onClick={() => deleteComment.mutate({ id: props.comment.id })}
                  className="button button-destructive"
                >
                  <PiTrash />
                  Supprimer
                </Button>
              </Ariakit.Popover>
            </Ariakit.PopoverProvider>
          </div>
        )}
    </article>
  );
}

function CommentForm(props: {
  slug: string;
  parentId?: string;
  id?: string;
  content?: string;
  cancel?: () => void;
}) {
  const trpc = useTRPC();

  const createComment = useMutation(
    trpc.comments.create.mutationOptions({
      onSettled: (_, __, ___, ____, context) =>
        context.client.invalidateQueries(
          trpc.comments.getAll.queryFilter({ serieSlug: props.slug })
        ),
      onSuccess: () => props.cancel?.() ?? form.reset(),
    })
  );

  const updateComment = useMutation(
    trpc.comments.update.mutationOptions({
      onSettled: (_, __, ___, ____, context) =>
        context.client.invalidateQueries(
          trpc.comments.getAll.queryFilter({ serieSlug: props.slug })
        ),
      onSuccess: () => props.cancel?.(),
    })
  );

  const form = useAppForm({
    defaultValues: {
      content: props.content ?? "",
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: z.object({
        content: z.string().trim().min(1, "Veuillez taper un commentaire"),
      }),
    },
    onSubmit: ({ value }) => {
      if (props.id) {
        updateComment.mutate({ ...value, id: props.id });
        return;
      }
      createComment.mutate({
        ...value,
        serieSlug: props.slug,
        ...(props.parentId && { parentId: props.parentId }),
      });
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppField name="content">
        {(field) => <field.TextareaInput maxRows={10} />}
      </form.AppField>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          content: state.values.content,
        })}
      >
        {({ canSubmit, content }) => (
          <div className="button-container">
            <Button
              onClick={() => {
                props.cancel?.() ?? form.reset();
              }}
              className="button button-outline"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit || !content}
              className="button button-primary"
            >
              {props.parentId ? "Répondre" : props.id ? "Éditer" : "Envoyer"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
