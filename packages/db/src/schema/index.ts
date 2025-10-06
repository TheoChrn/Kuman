import * as volumes from ".//volumes";
import * as bookmarks from "./bookmarks";
import * as chapters from "./chapters";
import * as comments from "./comments";
import * as mangas from "./mangas";
import * as sessions from "./sessions";
import * as users from "./users";

export const schema = {
  ...sessions,
  ...users,
  ...chapters,
  ...mangas,
  ...volumes,
  ...bookmarks,
  ...comments,
};
