import { RouterOutputs } from "@kuman/api";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useBlocker } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useRef } from "react";
import DesktopMenu from "~/components/chapter/menu/desktop-menu";
import MobileMenu from "~/components/chapter/menu/mobile-menu";
import { useDevice } from "~/hooks/use-device";
import { useChapterNavigation } from "~/hooks/use-read-chapter";
import { Route } from "~/routes/$serieSlug.chapter.$chapterNumber.$page";
import { useTRPC } from "~/trpc/react";
import { appStore } from "~/utils/stores/chapter-store";
import { ChapterImage } from "~/components/chapter-image";

export function Chapter({
  chapter,
}: {
  chapter:
    | RouterOutputs["chapters"]["get"]
    | RouterOutputs["chapters"]["getFreeChapter"];
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { device } = useDevice();
  const params = Route.useParams();

  const [chapterNumber, page, serieSlug] = [
    Number(params.chapterNumber),
    Number(params.page),
    params.serieSlug,
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data: chapterList } = useSuspenseQuery(
    trpc.chapters.getAllFromSerieGrouppedByVolume.queryOptions({
      serie: serieSlug,
    })
  );

  const readingMode = useStore(
    appStore,
    (state) => state.preferences.readingMode
  );

  const { blockObserver, scrollToPage } = useChapterNavigation({
    serieSlug,
    chapterNumber,
    page,
    pageRefs,
    readingMode,
  });

  const upsertBookmark = useMutation(
    trpc.bookmarks.upsert.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.setQueryData(
          trpc.bookmarks.get.queryKey({ mangaSlug: variables.mangaSlug }),
          variables
        );
        queryClient.invalidateQueries(
          trpc.bookmarks.get.queryFilter({
            mangaSlug: variables.mangaSlug,
          })
        );

        queryClient.setQueryData(
          trpc.mangas.get.queryKey({ slug: variables.mangaSlug }),
          (prevData) => {
            if (!prevData) return prevData;

            return {
              ...prevData,
              currentChapter: variables.currentChapter,
              currentPage: variables.currentPage,
            };
          }
        );

        queryClient.invalidateQueries(
          trpc.mangas.get.queryFilter({
            slug: variables.mangaSlug,
          })
        );
      },
    })
  );

  useBlocker({
    shouldBlockFn: ({ current, next }) => {
      if (
        current.routeId !== next.routeId ||
        (current.routeId === next.routeId &&
          (current.params as typeof params).chapterNumber !==
            (next.params as typeof params).chapterNumber)
      ) {
        upsertBookmark.mutate({
          currentChapter: chapterNumber,
          currentPage: page,
          mangaSlug: serieSlug,
        });
      }

      return false;
    },
    enableBeforeUnload: false,
  });

  return (
    <div>
      {device ? (
        device !== "desktop" ? (
          <MobileMenu
            serieSlug={serieSlug}
            chapter={chapter}
            chapterList={chapterList}
            currentChapter={chapterNumber}
            currentPage={page}
            blockObserver={blockObserver}
            scrollToPage={(value) => {
              blockObserver.current = true;
              scrollToPage(value);
            }}
          />
        ) : (
          <DesktopMenu
            serieSlug={serieSlug}
            chapter={chapter}
            chapterList={chapterList}
            currentChapter={chapterNumber}
            currentPage={page}
            blockObserver={blockObserver}
          />
        )
      ) : null}

      <section
        key={chapter.number}
        ref={containerRef}
        className={`chapter-images-container ${
          readingMode === "scroll"
            ? "chapter-images-container-scroll-y"
            : "chapter-images-container-scroll-x"
        }`}
      >
        {chapter.pages?.map((element, index) => {
          return (
            <ChapterImage
              key={index}
              index={index}
              src={element}
              alt={`Chapitre ${chapter.number} - Page ${index + 1}`}
              chapterNumber={chapterNumber}
              ref={(el) => {
                pageRefs.current[index] = el;
              }}
            />
          );
        })}
      </section>
    </div>
  );
}
