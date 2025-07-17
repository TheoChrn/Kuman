import * as session from "./sessions";
import * as user from "./users/schema";

export const schema = {
  ...session,
  ...user,
};
