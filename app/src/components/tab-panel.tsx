import * as Ariakit from "@ariakit/react";
import { useEffect, useId, useRef } from "react";

function usePrevious<T>(value: T) {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function TabPanel(props: Ariakit.TabPanelProps) {
  const tab = Ariakit.useTabContext();
  const id = props.id ?? useId();
  const tabId = Ariakit.useStoreState(
    tab,
    () => props.tabId ?? tab?.panels.item(id)?.tabId
  );
  const previousTabId = usePrevious(Ariakit.useStoreState(tab, "selectedId"));
  const wasOpen = tabId && previousTabId === tabId;
  return (
    <Ariakit.TabPanel
      ref={props.ref}
      {...props}
      id={id}
      tabId={tabId}
      data-was-open={wasOpen || undefined}
    />
  );
}
