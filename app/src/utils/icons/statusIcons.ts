import { Status } from "@kuman/db/enums";
import { IconType } from "react-icons/lib";
import { PiPauseBold, PiPlayBold, PiCheckBold } from "react-icons/pi";

export const statusIcons = {
  pause: PiPauseBold,
  ongoing: PiPlayBold,
  completed: PiCheckBold,
} as const satisfies Record<Status, IconType>;
