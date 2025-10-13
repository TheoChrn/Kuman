import * as Ariakit from "@ariakit/react";
import { role } from "@kuman/db/enums";
import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaBars, FaPlus } from "react-icons/fa6";
import { PiLockKeyBold } from "react-icons/pi";
import { DesktopMenuProps } from "~/components/chapter/menu/desktop-menu";
import { ReadingMode } from "~/components/chapter/menu/reading-mode";
import { Select, SelectItem } from "~/components/ui/inputs/select/select";

export interface MobileMenuProps extends DesktopMenuProps {
  scrollToPage: (pageIndex: number) => void;
}
export default function MobileMenu(props: MobileMenuProps) {
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState(props.currentPage);

  const { user } = useRouteContext({
    from: "/$serieSlug/chapter/$chapterNumber/$page",
  });

  useEffect(() => {
    setSliderValue(props.currentPage);
  }, [props.currentPage]);

  return (
    <Ariakit.DialogProvider>
      <Ariakit.DialogDisclosure id="dialog-trigger" className="dialog-trigger">
        <Ariakit.VisuallyHidden>Ouvrir le menu</Ariakit.VisuallyHidden>
        <FaBars size={24} className="burger" />
        <FaPlus size={24} className="close" />
      </Ariakit.DialogDisclosure>
      <Ariakit.Dialog
        getPersistentElements={() => {
          const el = document.querySelector("#dialog-trigger");
          return el ? [el] : [];
        }}
        className="content"
      >
        <Link
          to="/$serieSlug/volumes"
          params={{ serieSlug: props.serieSlug }}
          className="back"
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
            <Ariakit.SelectGroup key={list.volumeNumber}>
              <Ariakit.SelectGroupLabel className="select-group-label">
                Volume - {list.volumeNumber}
              </Ariakit.SelectGroupLabel>
              {list.chapters.map((chapter) => (
                <SelectItem
                  key={chapter.number}
                  className="select-item"
                  disabled={props.currentChapter === chapter.number}
                  hideOnClick
                  aria-disabled={
                    chapter.number !== 1 &&
                    user?.role !== role.SUBSCRIBER &&
                    user?.role !== role.ADMINISTRATOR
                  }
                  render={(renderProps) => (
                    <Link
                      {...renderProps}
                      to={
                        chapter.number !== 1 &&
                        user?.role !== role.SUBSCRIBER &&
                        user?.role !== role.ADMINISTRATOR
                          ? "."
                          : "/$serieSlug/chapter/$chapterNumber/$page"
                      }
                      preload="intent"
                      params={{
                        serieSlug: props.serieSlug,
                        chapterNumber: String(chapter.number),
                        page: "1",
                      }}
                    />
                  )}
                >
                  {chapter.number !== 1 &&
                    user?.role !== role.SUBSCRIBER &&
                    user?.role !== role.ADMINISTRATOR && <PiLockKeyBold />}

                  {`Chapitre ${String(chapter.number).padStart(3, "0")} - ${
                    chapter.name
                  }`}
                </SelectItem>
              ))}
            </Ariakit.SelectGroup>
          ))}
        </Select>

        <div className="range">
          {props.chapter.pages?.length}
          <input
            type="range"
            max={props.chapter.pages?.length}
            min={1}
            value={sliderValue}
            onPointerUp={(e) => {
              const value = (e.target as HTMLInputElement).valueAsNumber;
              navigate({
                to: "/$serieSlug/chapter/$chapterNumber/$page",
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
