import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { Scroll } from "~/components/reading-mode/scroll";
import { SinglePage } from "~/components/reading-mode/single-page";
import { FreeChapter } from "~/components/chapter/free/free-chapter";
import { PremiumChapter } from "~/components/chapter/premium/premium-chapter";
import { role } from "@kuman/db/enums";
import { LoadingSpinner } from "~/components/loading-spinner";

export const readingModeMapping = {
  scroll: Scroll,
  singlePage: SinglePage,
};

export const readingModes = ["scroll", "singlePage"] as const;
type ReadingModes = typeof readingModes;
export type ReadingMode = ReadingModes[number];

export const Route = createFileRoute(
  "/$serieSlug/chapter/$chapterNumber/$page"
)({
  pendingComponent: () => (
    <LoadingSpinner className="loading-spinner-absolute" />
  ),
  component: RouteComponent,
  beforeLoad: async ({ context: { user }, params: { chapterNumber } }) => {
    if (chapterNumber.startsWith(".")) {
      throw redirect({ to: "/", replace: true });
    }

    const num = Number(chapterNumber);
    if (isNaN(num) || num < 1) {
      throw notFound();
    }

    if (num > 1 && !user) {
      throw redirect({ to: "/auth/login" });
    }

    if (user?.role === role.USER) {
      throw redirect({ to: "/profile/abonnement" });
    }
  },

  loader: async ({
    context: { trpc, queryClient, user },
    params: { chapterNumber, serieSlug },
  }) => {
    if (
      Number(chapterNumber) === 1 &&
      (!user?.role || user?.role === role.USER)
    ) {
      queryClient.prefetchQuery(
        trpc.chapters.getFreeChapter.queryOptions({
          chapterNumber: Number(chapterNumber),
          serie: serieSlug,
        })
      );
    } else {
      queryClient.prefetchQuery(
        trpc.chapters.get.queryOptions({
          chapterNumber: Number(chapterNumber),
          serie: serieSlug,
        })
      );
    }
    queryClient.prefetchQuery(
      trpc.chapters.getAllFromSerieGrouppedByVolume.queryOptions({
        serie: serieSlug,
      })
    );
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const { user } = Route.useRouteContext();

  const [chapterNumber, serieSlug] = [
    Number(params.chapterNumber),
    params.serieSlug,
  ];

  if (chapterNumber === 1 && (!user || user.role === role.USER)) {
    return <FreeChapter chapterNumber={chapterNumber} serie={serieSlug} />;
  }

  return <PremiumChapter chapterNumber={chapterNumber} serie={serieSlug} />;
}
