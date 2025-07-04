import {ulid} from "ulidx"

export const generateUserId = () => `user_${ulid()}`
export const generateMangaId = () => `manga_${ulid()}`
export const generateTomeId = () => `tome_${ulid()}`
export const generateChapterId = () => `chapter_${ulid()}`
export const generateCommentId = () => `chapter_${ulid()}`
