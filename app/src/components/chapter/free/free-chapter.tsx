import { useSuspenseQuery } from "@tanstack/react-query";
import { Chapter } from "~/components/chapter/route-component";
import { useTRPC } from "~/trpc/react";

export function FreeChapter({
  chapterNumber,
  serie,
}: {
  chapterNumber: number;
  serie: string;
}) {
  const trpc = useTRPC();

  const { data: chapter } = useSuspenseQuery(
    trpc.chapters.getFreeChapter.queryOptions({ chapterNumber, serie })
  );

  return <Chapter chapter={chapter} />;
}
