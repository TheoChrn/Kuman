import * as chapters from "./chapters";
import * as sessions from "./sessions";
import * as users from "./users";

export const schema = {
  ...sessions,
  ...users,
  ...chapters,
};
