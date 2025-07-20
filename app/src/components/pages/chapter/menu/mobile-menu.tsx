import * as Ariakit from "@ariakit/react";
import { Link } from "@tanstack/react-router";
import { FaArrowLeft, FaBars, FaPlus } from "react-icons/fa6";
import { Select } from "~/components/ui/select";
import styles from "./styles.module.scss";
import { RouterOutputs } from "@kuman/api";

interface MobileMenuProps {
  chapter: RouterOutputs["chapters"]["get"]
  chapterList: RouterOutputs["chapters"]["getAll"]
}
export default function MobileMenu(props: ) {
  return (
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
                <label key={option} className={styles["reading-mode-label"]}>
                  <Ariakit.VisuallyHidden>
                    <Ariakit.Radio
                      value={option}
                      checked={option === readingMode}
                      onChange={(e) =>
                        appActions.setReadingMode(e.target.value as ReadingMode)
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
  );
}
