import * as Ariakit from "@ariakit/react";
import { RouterOutputs } from "@kuman/api";
import { Link } from "@tanstack/react-router";
import { RefObject } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { PiGear } from "react-icons/pi";
import { Select, SelectItem } from "~/components/ui/inputs/select/select";
import styles from "./styles.module.scss";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import {
  readingModeMapping,
  readingModes,
} from "~/components/route-components/chapter/menu/reading-mode";
import { appActions, appStore } from "~/utils/stores/chapter-store";
import { ReadingMode } from "~/routes/$chapterNumber.$page";
import { useStore } from "@tanstack/react-store";

export interface DesktopMenuProps {
  chapter: RouterOutputs["chapters"]["get"];
  chapterList: RouterOutputs["chapters"]["getAll"];
  currentPage: number;
  currentChapter: number;
  blockObserver: RefObject<boolean>;
}
export default function DesktopMenu(props: DesktopMenuProps) {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const readingMode = useStore(
    appStore,
    (state) => state.preferences.readingMode
  );
  return (
    <div className={styles["content"]}>
      <Link to="/" className={styles.back}>
        <FaArrowLeft size={32} />
        <Ariakit.VisuallyHidden>Retour</Ariakit.VisuallyHidden>
      </Link>
      <Select
        selectProviderProps={{
          value: `Chapitre ${String(props.chapter.number).padStart(3, "0")} - ${
            props.chapter.name
          }`,
        }}
        selectProps={{
          className: `${styles["select"]} ${styles["select-chapter"]}`,
        }}
        selectPopoverProps={{
          className: styles["select-popover"],
          sameWidth: true,
          modal: true,
        }}
      >
        {props.chapterList.map((chapter) => (
          <SelectItem
            key={chapter.number}
            className={styles["select-item"]}
            disabled={props.currentChapter === chapter.number}
            render={(renderProps) => (
              <Link
                {...renderProps}
                to="/$chapterNumber/$page"
                preload="intent"
                params={{
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
      </Select>

      <div>
        <Select
          selectProviderProps={{
            value: `Page ${String(props.currentPage).padStart(2, "0")}`,
          }}
          selectProps={{
            className: `${styles["select"]} ${styles["select-page"]}`,
          }}
          selectPopoverProps={{
            className: styles["select-popover"],
            sameWidth: true,
            modal: true,
          }}
        >
          {Array.from({ length: Number(props.chapter.pageCount) }).map(
            (_, index) => (
              <SelectItem
                key={index + 1}
                disabled={props.currentPage === index + 1}
                onClick={() => (props.blockObserver.current = true)}
                render={(renderProps) => (
                  <Link
                    {...renderProps}
                    to="/$chapterNumber/$page"
                    params={{
                      chapterNumber: String(props.currentChapter),
                      page: String(index + 1),
                    }}
                  />
                )}
              >
                {`Page ${String(index + 1).padStart(2, "0")}`}
              </SelectItem>
            )
          )}
        </Select>
        <Ariakit.PopoverProvider>
          <Ariakit.PopoverDisclosure>
            <PiGear size={32} />
          </Ariakit.PopoverDisclosure>
          <Ariakit.Popover className={styles["popover"]} gutter={24}>
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
          </Ariakit.Popover>
        </Ariakit.PopoverProvider>
      </div>
    </div>
  );
}
