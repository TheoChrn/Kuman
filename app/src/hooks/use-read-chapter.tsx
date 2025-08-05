import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";

export function useChapterNavigation({
  serieSlug,
  chapterNumber,
  page,
  pageRefs,
  readingMode,
}: {
  serieSlug: string;
  chapterNumber: number;
  page: number;
  pageRefs: React.RefObject<(HTMLDivElement | null)[]>;
  readingMode: string;
}) {
  const navigate = useNavigate();
  const blockObserver = useRef(true);

  const scrollToPage = (pageIndex: number) => {
    const element = pageRefs.current[pageIndex];
    if (element) {
      requestAnimationFrame(() => {
        element.scrollIntoView({ block: "center", behavior: "instant" });
      });
    }
  };

  useEffect(() => {
    if (blockObserver.current) {
      scrollToPage(page - 1);
    }
  }, [page]);

  useEffect(() => {
    scrollToPage(page - 1);
  }, [readingMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = pageRefs.current.findIndex((el) => el === entry.target);
          if (index === -1) return;

          if (blockObserver.current) {
            if (index + 1 === page) {
              blockObserver.current = false;
            }
            return;
          }

          if (index + 1 !== page) {
            navigate({
              to: "/$serieSlug/$chapterNumber/$page",
              params: {
                serieSlug,
                chapterNumber: String(chapterNumber),
                page: String(index + 1),
              },
              replace: true,
            });
          }
        });
      },
      { root: null, threshold: 0.75 }
    );

    pageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [page, chapterNumber, readingMode]);

  return {
    blockObserver,
    scrollToPage,
  };
}
