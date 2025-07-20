import { jsxs, jsx } from 'react/jsx-runtime';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useStore, Store } from '@tanstack/react-store';
import { useRef, useState, useEffect } from 'react';
import * as Ariakit from '@ariakit/react';
import { useNavigate, Link } from '@tanstack/react-router';
import { FaBars, FaPlus, FaArrowLeft } from 'react-icons/fa6';
import { PiGear } from 'react-icons/pi';
import { u as useTRPC, R as Route } from './ssr.mjs';
import { LuRectangleHorizontal } from 'react-icons/lu';
import '@tanstack/react-router-with-query';
import '@trpc/client';
import '@trpc/tanstack-react-query';
import 'superjson';
import '@tanstack/react-query-devtools';
import '@tanstack/react-router-devtools';
import 'zod/v4';
import 'path';
import 'url';
import 'fs';
import 'os';
import 'crypto';
import 'node:crypto';
import 'pg';
import 'stream';
import 'http';
import 'punycode';
import 'https';
import 'zlib';
import 'events';
import 'net';
import 'tls';
import 'buffer';
import '@trpc/server';
import '@trpc/server/adapters/fetch';
import 'node:async_hooks';
import '@tanstack/react-router/ssr/server';

function Scroll() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(LuRectangleHorizontal, { size: 32, transform: "rotate(90)" }),
    /* @__PURE__ */ jsx(LuRectangleHorizontal, { size: 32, transform: "rotate(90)" })
  ] });
}
function SinglePage() {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(LuRectangleHorizontal, { size: 32, transform: "rotate(90)" }) });
}
const page = "_page_k50rl_1";
const styles$2 = {
  page,
  "img-container": "_img-container_k50rl_8"
};
function ChapterImage({ src, alt, ref }) {
  return /* @__PURE__ */ jsx("div", { ref, className: styles$2.page, children: /* @__PURE__ */ jsx("div", { className: styles$2["img-container"], children: /* @__PURE__ */ jsx("img", { src, alt }) }) });
}
const styles$1 = {
  "chapter-images-container": "_chapter-images-container_1jvph_1",
  "chapter-images-container-scroll-x": "_chapter-images-container-scroll-x_1jvph_7",
  "chapter-images-container-scroll-y": "_chapter-images-container-scroll-y_1jvph_13"
};
function Select({
  children,
  selectProviderProps,
  selectProps = {},
  selectPopoverProps = {}
}) {
  const { className: selectClassName, ...restSelectProps } = selectProps;
  const { className: popoverClassName, ...restPopoverProps } = selectPopoverProps;
  return /* @__PURE__ */ jsxs(Ariakit.SelectProvider, { ...selectProviderProps, children: [
    /* @__PURE__ */ jsx(Ariakit.Select, { ...restSelectProps, className: selectClassName }),
    /* @__PURE__ */ jsx(Ariakit.SelectPopover, { ...restPopoverProps, className: popoverClassName, children })
  ] });
}
function SelectItem(props) {
  return /* @__PURE__ */ jsx(Ariakit.SelectItem, { ...props, accessibleWhenDisabled: true });
}
const select = "_select_1nzmr_1";
const content = "_content_1nzmr_29";
const range = "_range_1nzmr_40";
const back = "_back_1nzmr_51";
const popover = "_popover_1nzmr_101";
const close = "_close_1nzmr_131";
const burger = "_burger_1nzmr_139";
const styles = {
  select,
  "select-popover": "_select-popover_1nzmr_17",
  content,
  range,
  back,
  "radio-group": "_radio-group_1nzmr_59",
  "reading-mode-label": "_reading-mode-label_1nzmr_67",
  popover,
  "select-page": "_select-page_1nzmr_107",
  "select-item": "_select-item_1nzmr_111",
  "dialog-trigger": "_dialog-trigger_1nzmr_120",
  close,
  burger,
  "select-chapter": "_select-chapter_1nzmr_160"
};
const appStore = new Store({
  preferences: { readingMode: "scroll" }
});
const appActions = {
  setReadingMode: (readingMode) => {
    appStore.setState((prev) => ({
      preferences: {
        ...prev.preferences,
        readingMode
      }
    }));
    localStorage.setItem(`readingMode`, readingMode);
  },
  loadReadingMode: () => {
    const readingMode = localStorage.getItem(
      "readingMode"
    );
    if (readingMode) {
      appActions.setReadingMode(readingMode);
    }
  }
};
const readingModeMapping = {
  scroll: Scroll,
  singlePage: SinglePage
};
const readingModes = ["scroll", "singlePage"];
function ReadingMode() {
  const readingMode = useStore(
    appStore,
    (state) => state.preferences.readingMode
  );
  return /* @__PURE__ */ jsx(Ariakit.RadioProvider, { children: /* @__PURE__ */ jsxs(Ariakit.RadioGroup, { className: styles["radio-group"], children: [
    /* @__PURE__ */ jsx(Ariakit.VisuallyHidden, { children: /* @__PURE__ */ jsx(Ariakit.GroupLabel, { children: "Options de lectures" }) }),
    readingModes.map((option) => {
      const ReadingMode2 = readingModeMapping[option];
      return /* @__PURE__ */ jsxs("label", { className: styles["reading-mode-label"], children: [
        /* @__PURE__ */ jsx(Ariakit.VisuallyHidden, { children: /* @__PURE__ */ jsx(
          Ariakit.Radio,
          {
            value: option,
            checked: option === readingMode,
            onChange: (e) => appActions.setReadingMode(e.target.value)
          }
        ) }),
        /* @__PURE__ */ jsx(ReadingMode2, {})
      ] }, option);
    })
  ] }) });
}
function DesktopMenu(props) {
  useQueryClient();
  useTRPC();
  const readingMode = useStore(
    appStore,
    (state) => state.preferences.readingMode
  );
  return /* @__PURE__ */ jsxs("div", { className: styles["content"], children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: styles.back, children: [
      /* @__PURE__ */ jsx(FaArrowLeft, { size: 32 }),
      /* @__PURE__ */ jsx(Ariakit.VisuallyHidden, { children: "Retour" })
    ] }),
    /* @__PURE__ */ jsx(
      Select,
      {
        selectProviderProps: {
          value: `Chapitre ${String(props.chapter.number).padStart(3, "0")} - ${props.chapter.name}`
        },
        selectProps: {
          className: `${styles["select"]} ${styles["select-chapter"]}`
        },
        selectPopoverProps: {
          className: styles["select-popover"],
          sameWidth: true,
          modal: true
        },
        children: props.chapterList.map((chapter) => /* @__PURE__ */ jsx(
          SelectItem,
          {
            className: styles["select-item"],
            disabled: props.currentChapter === chapter.number,
            render: /* @__PURE__ */ jsx(
              Link,
              {
                to: "/$chapterNumber/$page",
                preload: "intent",
                params: {
                  chapterNumber: String(chapter.number),
                  page: "1"
                }
              }
            ),
            children: `Chapitre ${String(chapter.number).padStart(3, "0")} - ${chapter.name}`
          },
          chapter.number
        ))
      }
    ),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        Select,
        {
          selectProviderProps: {
            value: `Page ${String(props.currentPage).padStart(2, "0")}`
          },
          selectProps: {
            className: `${styles["select"]} ${styles["select-page"]}`
          },
          selectPopoverProps: {
            className: styles["select-popover"],
            sameWidth: true,
            modal: true
          },
          children: Array.from({ length: Number(props.chapter.pageCount) }).map(
            (_, index) => /* @__PURE__ */ jsx(
              Ariakit.SelectItem,
              {
                className: styles["select-item"],
                accessibleWhenDisabled: true,
                disabled: props.currentPage === index + 1,
                onClick: () => props.blockObserver.current = true,
                render: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/$chapterNumber/$page",
                    params: {
                      chapterNumber: String(props.currentChapter),
                      page: String(index + 1)
                    }
                  }
                ),
                children: `Page ${String(index + 1).padStart(2, "0")}`
              },
              index + 1
            )
          )
        }
      ),
      /* @__PURE__ */ jsxs(Ariakit.PopoverProvider, { children: [
        /* @__PURE__ */ jsx(Ariakit.PopoverDisclosure, { children: /* @__PURE__ */ jsx(PiGear, { size: 32 }) }),
        /* @__PURE__ */ jsx(Ariakit.Popover, { className: styles["popover"], gutter: 24, children: /* @__PURE__ */ jsx(Ariakit.RadioProvider, { children: /* @__PURE__ */ jsxs(Ariakit.RadioGroup, { className: styles["radio-group"], children: [
          /* @__PURE__ */ jsx(Ariakit.VisuallyHidden, { children: /* @__PURE__ */ jsx(Ariakit.GroupLabel, { children: "Options de lectures" }) }),
          readingModes.map((option) => {
            const ReadingMode2 = readingModeMapping[option];
            return /* @__PURE__ */ jsxs(
              "label",
              {
                className: styles["reading-mode-label"],
                children: [
                  /* @__PURE__ */ jsx(Ariakit.VisuallyHidden, { children: /* @__PURE__ */ jsx(
                    Ariakit.Radio,
                    {
                      value: option,
                      checked: option === readingMode,
                      onChange: (e) => appActions.setReadingMode(
                        e.target.value
                      )
                    }
                  ) }),
                  /* @__PURE__ */ jsx(ReadingMode2, {})
                ]
              },
              option
            );
          })
        ] }) }) })
      ] })
    ] })
  ] });
}
function MobileMenu(props) {
  var _a, _b;
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState(props.currentPage);
  useEffect(() => {
    setSliderValue(props.currentPage);
  }, [props.currentPage]);
  return /* @__PURE__ */ jsxs(Ariakit.DialogProvider, { children: [
    /* @__PURE__ */ jsxs(
      Ariakit.DialogDisclosure,
      {
        id: "dialog-trigger",
        className: styles["dialog-trigger"],
        children: [
          /* @__PURE__ */ jsx(Ariakit.VisuallyHidden, { children: "Ouvrir le menu" }),
          /* @__PURE__ */ jsx(FaBars, { size: 24, className: styles.burger }),
          /* @__PURE__ */ jsx(FaPlus, { size: 24, className: styles.close })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      Ariakit.Dialog,
      {
        getPersistentElements: () => {
          const el = document.querySelector("#dialog-trigger");
          return el ? [el] : [];
        },
        className: styles["content"],
        children: [
          /* @__PURE__ */ jsxs(Link, { to: "/", className: styles.back, children: [
            /* @__PURE__ */ jsx(FaArrowLeft, { size: 24 }),
            /* @__PURE__ */ jsx(Ariakit.VisuallyHidden, { children: "Retour" })
          ] }),
          /* @__PURE__ */ jsx(
            Select,
            {
              selectProviderProps: {
                value: `Chapitre ${String(props.chapter.number).padStart(
                  3,
                  "0"
                )} - ${props.chapter.name}`
              },
              selectProps: {
                className: `${styles["select"]} ${styles["select-chapter"]}`
              },
              selectPopoverProps: {
                className: styles["select-popover"],
                sameWidth: true,
                modal: true
              },
              children: props.chapterList.map((chapter) => /* @__PURE__ */ jsx(
                SelectItem,
                {
                  className: styles["select-item"],
                  disabled: props.currentChapter === chapter.number,
                  render: /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: "/$chapterNumber/$page",
                      preload: "intent",
                      params: {
                        chapterNumber: String(chapter.number),
                        page: "1"
                      }
                    }
                  ),
                  children: `Chapitre ${String(chapter.number).padStart(3, "0")} - ${chapter.name}`
                },
                chapter.number
              ))
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: styles.range, children: [
            (_a = props.chapter.pages) == null ? void 0 : _a.length,
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "range",
                max: (_b = props.chapter.pages) == null ? void 0 : _b.length,
                min: 1,
                value: sliderValue,
                onPointerUp: (e) => {
                  const value = e.target.valueAsNumber;
                  navigate({
                    to: "/$chapterNumber/$page",
                    params: {
                      chapterNumber: String(props.currentChapter),
                      page: String(value)
                    },
                    replace: true
                  });
                },
                onChange: (e) => {
                  const value = e.target.valueAsNumber;
                  setSliderValue(value);
                  props.scrollToPage(value - 1);
                }
              }
            ),
            sliderValue
          ] }),
          /* @__PURE__ */ jsx(ReadingMode, {})
        ]
      }
    )
  ] });
}
function useDevice() {
  const [device, setDevice] = useState(null);
  useEffect(() => {
    const onResize = () => {
      setDevice(
        window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop"
      );
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { device };
}
function useChapterNavigation({
  chapterNumber,
  page: page2,
  pageRefs,
  readingMode
}) {
  const navigate = useNavigate();
  const blockObserver = useRef(true);
  const scrollToPage = (pageIndex) => {
    const element = pageRefs.current[pageIndex];
    if (element) {
      requestAnimationFrame(() => {
        element.scrollIntoView({ block: "center", behavior: "instant" });
      });
    }
  };
  useEffect(() => {
    if (blockObserver.current) {
      scrollToPage(page2 - 1);
    }
  }, [page2]);
  useEffect(() => {
    scrollToPage(page2 - 1);
  }, [readingMode]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = pageRefs.current.findIndex((el) => el === entry.target);
          if (index === -1) return;
          if (blockObserver.current) {
            if (index + 1 === page2) {
              blockObserver.current = false;
            }
            return;
          }
          if (index + 1 !== page2) {
            navigate({
              to: "/$chapterNumber/$page",
              params: {
                chapterNumber: String(chapterNumber),
                page: String(index + 1)
              },
              replace: true
            });
          }
        });
      },
      { root: null, threshold: 0.75 }
    );
    pageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [page2, chapterNumber, readingMode]);
  return {
    blockObserver,
    scrollToPage
  };
}
const SplitComponent = function RouteComponent() {
  var _a;
  const trpc = useTRPC();
  const {
    device
  } = useDevice();
  const params = Route.useParams();
  const [chapterNumber, page2] = [Number(params.chapterNumber), Number(params.page)];
  const {
    data: chapter
  } = useSuspenseQuery(trpc.chapters.get.queryOptions({
    chapterNumber
  }));
  const {
    data: chapterList
  } = useSuspenseQuery(trpc.chapters.getAll.queryOptions());
  const readingMode = useStore(appStore, (state) => state.preferences.readingMode);
  const containerRef = useRef(null);
  const pageRefs = useRef([]);
  const {
    blockObserver,
    scrollToPage
  } = useChapterNavigation({
    chapterNumber,
    page: page2,
    pageRefs,
    readingMode
  });
  return /* @__PURE__ */ jsxs("div", { children: [
    device ? device !== "desktop" ? /* @__PURE__ */ jsx(MobileMenu, { chapter, chapterList, currentChapter: chapterNumber, currentPage: page2, blockObserver, scrollToPage: (value) => {
      blockObserver.current = true;
      scrollToPage(value);
    } }) : /* @__PURE__ */ jsx(DesktopMenu, { chapter, chapterList, currentChapter: chapterNumber, currentPage: page2, blockObserver }) : null,
    /* @__PURE__ */ jsx("section", { ref: containerRef, className: `${styles$1["chapter-images-container"]} ${readingMode === "scroll" ? styles$1["chapter-images-container-scroll-y"] : styles$1["chapter-images-container-scroll-x"]}`, children: (_a = chapter.pages) == null ? void 0 : _a.map((element, index) => {
      return /* @__PURE__ */ jsx(ChapterImage, { index, src: element.signedUrl, alt: `Chapitre ${chapter.number} - Page ${index + 1}`, chapterNumber, ref: (el) => {
        pageRefs.current[index] = el;
      } }, index);
    }) }, chapter.number)
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=_chapterNumber._page-Djj06-I9.mjs.map
