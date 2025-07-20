import * as Ariakit from "@ariakit/react";
import styles from "./styles.module.scss";
import { Scroll } from "~/components/reading-mode/scroll";
import { SinglePage } from "~/components/reading-mode/single-page";
import { useStore } from "@tanstack/react-store";
import { appActions, appStore } from "~/utils/stores/chapter-store";

export const readingModeMapping = {
  scroll: Scroll,
  singlePage: SinglePage,
};

export const readingModes = ["scroll", "singlePage"] as const;
type ReadingModes = typeof readingModes;
export type ReadingModeValue = ReadingModes[number];

export function ReadingMode() {
  const readingMode = useStore(
    appStore,
    (state) => state.preferences.readingMode
  );

  return (
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
                    appActions.setReadingMode(e.target.value as ReadingModeValue)
                  }
                />
              </Ariakit.VisuallyHidden>
              <ReadingMode />
            </label>
          );
        })}
      </Ariakit.RadioGroup>
    </Ariakit.RadioProvider>
  );
}
