export const roleValues = [
  "user",
  "subscriber",
  "moderator",
  "administrator",
] as const;
export type RolesValues = typeof roleValues;
export type Role = RolesValues[number];

export const role = {
  USER: "user",
  SUBSCRIBER: "subscriber",
  MODERATOR: "moderator",
  ADMINISTRATOR: "administrator",
} as const satisfies Record<string, Role>;

export const roleLabelFrench = {
  [role.USER]: "utilisateur",
  [role.SUBSCRIBER]: "abonné",
  [role.MODERATOR]: "modérateur",
  [role.ADMINISTRATOR]: "administrateur",
} as const satisfies Record<Role, string>;
