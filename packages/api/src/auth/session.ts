import { Lucia, TimeSpan } from "lucia";
import { adapter } from "./lucia"

export const lucia = new Lucia(adapter, {
	sessionExpiresIn: new TimeSpan(7, "d")
});

// export async function createSession({
//   userId,
// }: {
//   userId: string;
// }) {
// 	return {
// 		session: await lucia.createSession(userId, {}),
// 	}
// }


// export async function validateSessionCookies(sessionId: Session["id"]) {
// 	const { session } = await lucia.validateSession(sessionId);

//   return {
//     user,
//     sessionId: sessionId,
//   };
// }