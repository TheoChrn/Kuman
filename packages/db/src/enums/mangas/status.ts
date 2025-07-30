export const statusValues = ["pause", "ongoing", "completed"] as const;
export type StatusValues = typeof statusValues;
export type Status = StatusValues[number];

export const status = {
  PAUSE: "pause",
  ONGOING: "ongoing",
  COMPLETED: "completed",
} as const satisfies Record<string, Status>;

export const statusLabelFrench = {
  [status.PAUSE]: "en pause",
  [status.ONGOING]: "en cours",
  [status.COMPLETED]: "complété",
} as const satisfies Record<Status, string>;
