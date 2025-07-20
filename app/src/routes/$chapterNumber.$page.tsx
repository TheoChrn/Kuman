import * as Ariakit from "@ariakit/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  notFound,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaBars, FaPlus } from "react-icons/fa6";
import styles from "~/components/chapter-number.module.scss";
import { ChapterImage } from "~/components/chapter-image";
import { Scroll } from "~/components/reading-mode/scroll";
import { SinglePage } from "~/components/reading-mode/single-page";
import { useTRPC } from "~/trpc/react";
import { appActions, appStore } from "~/utils/stores/chapter-store";
import { useDevice } from "~/hooks/use-device";
import { Select } from "~/components/ui/select";

const readingModeMapping = {
  scroll: Scroll,
  singlePage: SinglePage,
  // doublePage: DoublePage,
};

const readingModes = ["scroll", "singlePage"] as const;
type ReadingModes = typeof readingModes;
export type ReadingMode = ReadingModes[number];

export const Route = createFileRoute("/$chapterNumber/$page")({
  component: RouteComponent,
  loader: async ({
    context: { trpc, queryClient },
    params: { chapterNumber },
  }) => {
    const [chapter] = await Promise.all([
      queryClient.ensureQueryData(
        trpc.chapters.get.queryOptions({ chapterNumber })
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
  const { chapterNumber, page } = Route.useParams();
  const { data: chapter } = useSuspenseQuery(
    trpc.chapters.get.queryOptions({ chapterNumber })
  );
  const { data: chapterList } = useSuspenseQuery(
    trpc.chapters.getAll.queryOptions()
  );
  const navigate = useNavigate();

  const readingMode = useStore(
    appStore,
    (state) => state.preferences.readingMode
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [sliderValue, setSliderValue] = useState(page);
  const blockOvserver = useRef(false);

  const scrollToPage = (pageIndex: number) => {
    const element = pageRefs.current[pageIndex];
    if (element) {
      element.scrollIntoView({ block: "center", behavior: "instant" });
    }
  };

  useEffect(() => {
    appActions.loadReadingMode();
  }, []);

  useEffect(() => {
    setSliderValue(page);
    if (blockOvserver.current) {
      scrollToPage(Number(page) - 1);
      blockOvserver.current = false;
    }
  }, [chapterNumber, readingMode, page]);

  const handleSliderChange = (value: number) => {
    blockOvserver.current = true;
    setSliderValue(String(value));
    scrollToPage(value - 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (blockOvserver.current) return;

          if (entry.isIntersecting) {
            const index = pageRefs.current.findIndex(
              (el) => el === entry.target
            );
            if (index === -1) return;

            if (Number(page) !== index + 1) {
              setSliderValue(String(index + 1));
              navigate({
                to: "/$chapterNumber/$page",
                params: { chapterNumber, page: String(index + 1) },
                replace: true,
              });
            }
          }
        });
      },
      { root: null, threshold: 0.75 }
    );

    pageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [page, chapterNumber]);

  return (
    <div>
      {device !== "desktop" ? (
        <Ariakit.DialogProvider>
          <Ariakit.DialogDisclosure id="dialog-trigger" className={styles.btn}>
            <Ariakit.VisuallyHidden>Ouvrir le menu</Ariakit.VisuallyHidden>
            <FaBars size={24} className={styles.burger} />
            <FaPlus size={24} className={styles.close} />
          </Ariakit.DialogDisclosure>
          <Ariakit.Dialog
            getPersistentElements={() => {
              const el = document.querySelector("#dialog-trigger");
              return el ? [el] : [];
            }}
            className={styles["content"]}
          >
            <Link to="/" className={styles.back}>
              <FaArrowLeft size={24} />
              <Ariakit.VisuallyHidden>Retour</Ariakit.VisuallyHidden>
            </Link>
            <Select
              selectProviderProps={{
                value: `Chapitre ${String(chapter.number).padStart(3, "0")} - ${
                  chapter.name
                }`,
              }}
              selectProps={{ className: styles.select }}
              selectPopoverProps={{
                className: styles["select-popover"],
                sameWidth: true,
              }}
            >
              {chapterList.map((chapter) => (
                <Ariakit.SelectItem
                  key={chapter.number}
                  className={styles["select-item"]}
                  render={
                    <Link
                      to="/$chapterNumber/$page"
                      params={{
                        chapterNumber: String(chapter.number),
                        page: "1",
                      }}
                    />
                  }
                >
                  {`Chapitre ${String(chapter.number).padStart(3, "0")} - ${
                    chapter.name
                  }`}
                </Ariakit.SelectItem>
              ))}
            </Select>

            <div className={styles.range}>
              {chapter.pages?.length}
              <input
                type="range"
                max={chapter.pages?.length}
                min={1}
                value={sliderValue}
                onPointerUp={(e) => {
                  const value = (e.target as HTMLInputElement).valueAsNumber;
                  navigate({
                    to: "/$chapterNumber/$page",
                    params: { chapterNumber, page: String(value) },
                    replace: true,
                  });
                  blockOvserver.current = false;
                }}
                onChange={(e) => {
                  console.log("onChange");
                  blockOvserver.current = true;
                  const value = e.target.valueAsNumber;
                  handleSliderChange(value);
                }}
                onKeyUp={(e) => {
                  const value = (e.target as HTMLInputElement).valueAsNumber;

                  if (value === 1 || value === chapter.pageCount) return;

                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    navigate({
                      to: "/$chapterNumber/$page",
                      params: { chapterNumber, page: String(value) },
                      replace: true,
                    });
                    blockOvserver.current = false;
                  }
                }}
              />

              {sliderValue}
            </div>
            <Ariakit.RadioProvider>
              <Ariakit.RadioGroup className={styles["radio-group"]}>
                <Ariakit.VisuallyHidden>
                  <Ariakit.GroupLabel>Options de lectures</Ariakit.GroupLabel>
                </Ariakit.VisuallyHidden>
                {readingModes.map((option) => {
                  const ReadingMode = readingModeMapping[option];
                  return (
                    <label
                      key={option}
                      className={styles["reading-mode-label"]}
                    >
                      <Ariakit.VisuallyHidden>
                        <Ariakit.Radio
                          value={option}
                          checked={option === readingMode}
                          onChange={(e) =>
                            appActions.setReadingMode(
                              e.target.value as ReadingMode
                            )
                          }
                        />
                      </Ariakit.VisuallyHidden>
                      <ReadingMode />
                    </label>
                  );
                })}
              </Ariakit.RadioGroup>
            </Ariakit.RadioProvider>
          </Ariakit.Dialog>
        </Ariakit.DialogProvider>
      ) : (
        <div className={styles["content"]}>
          <Link to="/" className={styles.back}>
            <FaArrowLeft size={32} />
            <Ariakit.VisuallyHidden>Retour</Ariakit.VisuallyHidden>
          </Link>
          <Select
            selectProviderProps={{
              value: `Chapitre ${String(chapter.number).padStart(3, "0")} - ${
                chapter.name
              }`,
            }}
            selectProps={{ className: styles["select-chapter"] }}
            selectPopoverProps={{
              className: styles["select-popover"],
              sameWidth: true,
              modal: true,
            }}
          >
            {chapterList.map((chapter) => (
              <Ariakit.SelectItem
                key={chapter.number}
                className={styles["select-item"]}
                render={
                  <Link
                    to="/$chapterNumber/$page"
                    params={{
                      chapterNumber: String(chapter.number),
                      page: "1",
                    }}
                  />
                }
              >
                {`Chapitre ${String(chapter.number).padStart(3, "0")} - ${
                  chapter.name
                }`}
              </Ariakit.SelectItem>
            ))}
          </Select>

          <Select
            selectProviderProps={{
              value: `Page ${page.padStart(2, "0")}`,
            }}
            selectProps={{ className: styles["select-page"] }}
            selectPopoverProps={{
              className: styles["select-popover-page"],
              sameWidth: true,
              modal: true,
            }}
          >
            {Array.from({ length: Number(chapter.pageCount) }).map(
              (_, index) => (
                <Ariakit.SelectItem
                  key={index + 1}
                  className={styles["select-item"]}
                  onClick={() => (blockOvserver.current = true)}
                  render={
                    <Link
                      to="/$chapterNumber/$page"
                      params={{
                        chapterNumber,
                        page: String(index + 1),
                      }}
                    />
                  }
                >
                  {`Page ${String(index + 1).padStart(2, "0")}`}
                </Ariakit.SelectItem>
              )
            )}
          </Select>
          {/* <Ariakit.RadioProvider>
            <Ariakit.RadioGroup className={styles["radio-group"]}>
              <Ariakit.VisuallyHidden>
                <Ariakit.GroupLabel>Options de lectures</Ariakit.GroupLabel>
              </Ariakit.VisuallyHidden>
              {readingModes.map((option) => {
                const ReadingMode = readingModeMapping[option];
                return (
                  <label key={option} className={styles["reading-mode-label"]}>
                    <Ariakit.VisuallyHidden>
                      <Ariakit.Radio
                        value={option}
                        checked={option === readingMode}
                        onChange={(e) =>
                          appActions.setReadingMode(
                            e.target.value as ReadingMode
                          )
                        }
                      />
                    </Ariakit.VisuallyHidden>
                    <ReadingMode />
                  </label>
                );
              })}
            </Ariakit.RadioGroup>
          </Ariakit.RadioProvider> */}
        </div>
      )}

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
