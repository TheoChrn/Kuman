import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  notFound,
  redirect
} from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useRef } from "react";
import { ChapterImage } from "~/components/chapter-image";
import styles from "~/components/chapter-number.module.scss";
import DesktopMenu from "~/components/pages/chapter/menu/desktop-menu";
import MobileMenu from "~/components/pages/chapter/menu/mobile-menu";
import { Scroll } from "~/components/reading-mode/scroll";
import { SinglePage } from "~/components/reading-mode/single-page";
import { useDevice } from "~/hooks/use-device";
import { useChapterNavigation } from "~/hooks/use-read-chapter";
import { useTRPC } from "~/trpc/react";
import { appStore } from "~/utils/stores/chapter-store";

export const readingModeMapping = {
  scroll: Scroll,
  singlePage: SinglePage,
  // doublePage: DoublePage,
};

export const readingModes = ["scroll", "singlePage"] as const;
type ReadingModes = typeof readingModes;
export type ReadingMode = ReadingModes[number];

export const Route = createFileRoute("/$chapterNumber/$page")({
  pendingComponent: () => {
    return <div>Charge</div>;
  },
  component: RouteComponent,
  loader: async ({
    context: { trpc, queryClient },
    params: { chapterNumber },
  }) => {
    const [chapter] = await Promise.all([
      queryClient.ensureQueryData(
        trpc.chapters.get.queryOptions({ chapterNumber: Number(chapterNumber) })
      ),
      queryClient.ensureQueryData(trpc.chapters.getAll.queryOptions()),
    ]);

    if (!chapter) throw new Error("This chapter doesn't exists");
  },
  params: {
    parse: (params) => {
      if (
        params.chapterNumber.startsWith(".") ||
        params.chapterNumber === "well-known"
      ) {
        throw redirect({ to: "/", replace: true });
      }

      const num = Number(params.chapterNumber);
      if (isNaN(num) || num < 1) {
        throw notFound();
      }

      return params;
    },
  },
});

function RouteComponent() {
  const trpc = useTRPC();
  const { device } = useDevice();
  const params = Route.useParams();

  const [chapterNumber, page] = [
    Number(params.chapterNumber),
    Number(params.page),
  ];
  const { data: chapter } = useSuspenseQuery(
    trpc.chapters.get.queryOptions({ chapterNumber })
  );
  const { data: chapterList } = useSuspenseQuery(
    trpc.chapters.getAll.queryOptions()
  );

  const readingMode = useStore(
    appStore,
    (state) => state.preferences.readingMode
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { blockObserver, scrollToPage } = useChapterNavigation({
    chapterNumber,
    page,
    pageRefs,
    readingMode,
  });

  return (
    <div>
      {device ? (
        device !== "desktop" ? (
          <MobileMenu
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
        className={`${styles["chapter-images-container"]} ${
          readingMode === "scroll"
            ? styles["chapter-images-container-scroll-y"]
            : styles["chapter-images-container-scroll-x"]
        }`}
      >
        {chapter.pages?.map((element, index) => {
          return (
            <ChapterImage
              key={index}
              index={index}
              src={element.signedUrl}
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
