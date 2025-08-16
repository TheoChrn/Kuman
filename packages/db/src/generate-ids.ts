import { ulid } from "ulidx";

export const generateUserId = () => `user_${ulid()}`;
export const generateMangaId = () => `manga_${ulid()}`;
export const generateTomeId = () => `tome_${ulid()}`;
export const generateBookmarkId = () => `bookmark${ulid()}`;
export const generateChapterId = () => `chapter_${ulid()}`;
export const generateCommentId = () => `comment_${ulid()}`;
export const generateGenreId = () => `genre_${ulid()}`;
export const generateTypeId = () => `type${ulid()}`;
