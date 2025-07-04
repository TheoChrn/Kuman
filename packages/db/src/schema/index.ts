import * as session from "./session"
import * as user from "./user/schema"

export const schema = {
    ...session,
    ...user,
}