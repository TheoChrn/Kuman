import * as volumes from ".//volumes";
import * as chapters from "./chapters";
import * as mangas from "./mangas";
import * as sessions from "./sessions";
import * as users from "./users";

export const schema = {
  ...sessions,
  ...users,
  ...chapters,
  ...mangas,
  ...volumes,
};
