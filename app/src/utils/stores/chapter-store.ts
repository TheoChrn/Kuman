import { Store } from "@tanstack/react-store";
import { ReadingMode } from "~/routes/$serieSlug.$chapterNumber.$page";

interface AppState {
  preferences: {
    readingMode: ReadingMode;
  };
}

export const appStore = new Store<AppState>({
  preferences: { readingMode: "scroll" },
});

export const appActions = {
  setReadingMode: (readingMode: ReadingMode) => {
    appStore.setState((prev) => ({
      preferences: {
        ...prev.preferences,
        readingMode,
      },
    }));
    localStorage.setItem(`readingMode`, readingMode);
  },

  loadReadingMode: () => {
    const readingMode = localStorage.getItem(
      "readingMode"
    ) as ReadingMode | null;
    if (readingMode) {
      appActions.setReadingMode(readingMode);
    }
  },
};
