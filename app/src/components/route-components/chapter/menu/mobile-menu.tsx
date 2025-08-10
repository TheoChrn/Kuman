import * as Ariakit from "@ariakit/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaBars, FaPlus } from "react-icons/fa6";
import { DesktopMenuProps } from "~/components/route-components/chapter/menu/desktop-menu";
import { ReadingMode } from "~/components/route-components/chapter/menu/reading-mode";
import { Select, SelectItem } from "~/components/ui/inputs/select/select";
import styles from "./styles.module.scss";

export interface MobileMenuProps extends DesktopMenuProps {
  scrollToPage: (pageIndex: number) => void;
}
export default function MobileMenu(props: MobileMenuProps) {
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState(props.currentPage);

  useEffect(() => {
    setSliderValue(props.currentPage);
  }, [props.currentPage]);

  return (
    <Ariakit.DialogProvider>
      <Ariakit.DialogDisclosure
        id="dialog-trigger"
        className={styles["dialog-trigger"]}
      >
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
        <Link
          to="/$serieSlug/volumes"
          params={{ serieSlug: props.serieSlug }}
          className={styles.back}
        >
          <FaArrowLeft size={24} />
          <Ariakit.VisuallyHidden>Retour</Ariakit.VisuallyHidden>
        </Link>
        <Select
          selectProviderProps={{
            value: `Chapitre ${String(props.chapter.number).padStart(
              3,
              "0"
            )} - ${props.chapter.name}`,
          }}
          selectProps={{
            className: `${styles["select"]} ${styles["select-chapter"]}`,
          }}
          selectPopoverProps={{
            className: styles["select-popover"],
            sameWidth: true,
            portal: true,
            preventBodyScroll: true,
          }}
        >
          {props.chapterList.map((list) => (
            <Ariakit.SelectGroup>
              <Ariakit.SelectGroupLabel
                className={styles["select-group-label"]}
              >
                Volume - {list.volumeNumber}
              </Ariakit.SelectGroupLabel>
              {list.chapters.map((chapter) => (
                <SelectItem
                  key={chapter.number}
                  className={styles["select-item"]}
                  disabled={props.currentChapter === chapter.number}
                  hideOnClick
                  render={(renderProps) => (
                    <Link
                      {...renderProps}
                      to="/$serieSlug/$chapterNumber/$page"
                      preload="intent"
                      params={{
                        serieSlug: props.serieSlug,
                        chapterNumber: String(chapter.number),
                        page: "1",
                      }}
                    />
                  )}
                >
                  {`Chapitre ${String(chapter.number).padStart(3, "0")} - ${
                    chapter.name
                  }`}
                </SelectItem>
              ))}
            </Ariakit.SelectGroup>
          ))}
        </Select>

        <div className={styles.range}>
          {props.chapter.pages?.length}
          <input
            type="range"
            max={props.chapter.pages?.length}
            min={1}
            value={sliderValue}
            onPointerUp={(e) => {
              const value = (e.target as HTMLInputElement).valueAsNumber;
              navigate({
                to: "/$serieSlug/$chapterNumber/$page",
                params: {
                  serieSlug: props.serieSlug,
                  chapterNumber: String(props.currentChapter),
                  page: String(value),
                },
                replace: true,
              });
            }}
            onChange={(e) => {
              const value = e.target.valueAsNumber;
              setSliderValue(value);
              props.scrollToPage(value - 1);
            }}
          />

          {sliderValue}
        </div>
        <ReadingMode />
      </Ariakit.Dialog>
    </Ariakit.DialogProvider>
  );
}
