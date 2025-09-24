import * as Ariakit from "@ariakit/react";
import { RouterOutputs } from "@kuman/api";
import { Link } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { RefObject } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { PiGear } from "react-icons/pi";
import {
  readingModeMapping,
  readingModes,
} from "~/components/chapter/menu/reading-mode";
import { Select, SelectItem } from "~/components/ui/inputs/select/select";
import { appActions, appStore } from "~/utils/stores/chapter-store";

import { ReadingMode } from "~/routes/$serieSlug.chapter.$chapterNumber.$page";

export interface DesktopMenuProps {
  serieSlug: string;
  chapter: RouterOutputs["chapters"]["get"];
  chapterList: RouterOutputs["chapters"]["getAll"];
  currentPage: number;
  currentChapter: number;
  blockObserver: RefObject<boolean>;
}
export default function DesktopMenu(props: DesktopMenuProps) {
  const readingMode = useStore(
    appStore,
    (state) => state.preferences.readingMode
  );
  return (
    <div className="content">
      <Link
        to="/$serieSlug/volumes"
        params={{ serieSlug: props.serieSlug }}
        className="back"
      >
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
          className: "select select-chapter",
        }}
        selectPopoverProps={{
          className: "select-popover",
          sameWidth: true,
          portal: true,
          preventBodyScroll: true,
        }}
      >
        {props.chapterList.map((list) => (
          <Ariakit.SelectGroup>
            <Ariakit.SelectGroupLabel className="select-group-label">
              Volume - {list.volumeNumber}
            </Ariakit.SelectGroupLabel>
            {list.chapters.map((chapter) => (
              <SelectItem
                key={chapter.number}
                className="select-item"
                disabled={props.currentChapter === chapter.number}
                hideOnClick
                render={(renderProps) => (
                  <Link
                    {...renderProps}
                    to="/$serieSlug/chapter/$chapterNumber/$page"
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

      <div>
        <Select
          selectProviderProps={{
            value: `Page ${String(props.currentPage).padStart(2, "0")}`,
          }}
          selectProps={{
            className: "select select-page",
          }}
          selectPopoverProps={{
            className: "select-popover",
            sameWidth: true,
            portal: true,
            preventBodyScroll: true,
          }}
        >
          {Array.from({ length: Number(props.chapter.pageCount) }).map(
            (_, index) => (
              <SelectItem
                key={index + 1}
                disabled={props.currentPage === index + 1}
                onClick={() => (props.blockObserver.current = true)}
                hideOnClick
                render={(renderProps) => (
                  <Link
                    {...renderProps}
                    to="/$serieSlug/chapter/$chapterNumber/$page"
                    params={{
                      serieSlug: props.serieSlug,
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
          <Ariakit.Popover className="popover" gutter={24}>
            <Ariakit.RadioProvider>
              <Ariakit.RadioGroup className="radio-group">
                <Ariakit.VisuallyHidden>
                  <Ariakit.GroupLabel>Options de lectures</Ariakit.GroupLabel>
                </Ariakit.VisuallyHidden>
                {readingModes.map((option) => {
                  const ReadingMode = readingModeMapping[option];
                  return (
                    <label key={option} className="reading-mode-label">
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
