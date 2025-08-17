import { useSuspenseQuery } from "@tanstack/react-query";
import { ChapterRouteComponent } from "~/components/route-components/chapter/route-component";
import { useTRPC } from "~/trpc/react";

export function PremiumChapter({
  chapterNumber,
  serie,
}: {
  chapterNumber: number;
  serie: string;
}) {
  const trpc = useTRPC();

  const { data: chapter } = useSuspenseQuery(
    trpc.chapters.get.queryOptions({ chapterNumber, serie })
  );

  return <ChapterRouteComponent chapter={chapter} />;
}
