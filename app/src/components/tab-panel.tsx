import * as Ariakit from "@ariakit/react";
import { useEffect, useRef } from "react";

function usePrevious<T>(value: T) {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function TabPanel(props: Ariakit.TabPanelProps) {
  const tab = Ariakit.useTabContext();
  const selectedTabId = Ariakit.useStoreState(tab, "selectedId");
  const previousTabId = usePrevious(selectedTabId);

  const panel = Ariakit.useStoreState(tab, () => tab?.panels.item(props.id));

  const wasPanelOpen = panel?.tabId && previousTabId === panel.tabId;
  return (
    <Ariakit.TabPanel {...props} data-was-open={wasPanelOpen || undefined} />
  );
}
