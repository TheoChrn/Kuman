import * as Ariakit from "@ariakit/react";
import { genreValues, typeValues } from "@kuman/db/enums";
import { searchParamsSchema } from "@kuman/shared/validators";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { FaBars, FaPlus } from "react-icons/fa6";
import { Footer } from "~/components/footer";
import { Catalogue } from "~/components/catalogue";
import SearchSerie from "~/components/search/search-serie";
import { Button } from "~/components/ui/buttons/button";
import { useDevice } from "~/hooks/use-device";
import { genreIcons } from "~/utils/icons/genreIcons";
import { typeIcons } from "~/utils/icons/typeIcons";

export const Route = createFileRoute("/_navigationLayout/catalogue")({
  component: RouteComponent,
  loaderDeps: ({ search: { genres, types } }) => ({
    genres,
    types,
  }),
  loader: async ({
    context: { queryClient, trpc },
    deps: { genres, types },
  }) => {
    queryClient.prefetchQuery(
      trpc.mangas.getAll.queryOptions({ genres, types })
    );
  },
  validateSearch: searchParamsSchema,
});

function RouteComponent() {
  const { device } = useDevice();
  const searchParams = Route.useSearch();

  const [viewMoreGenres, toggleViewMoreGenres] = useState(false);

  return (
    <div id="catalogue">
      <Ariakit.HeadingLevel>
        <Ariakit.VisuallyHidden>
          <Ariakit.Heading>Catalogue</Ariakit.Heading>
        </Ariakit.VisuallyHidden>
        {device === "desktop" ? (
          <Ariakit.HeadingLevel>
            <section className="quick-filters">
              <div className="quick-filters-heading">
                <Ariakit.Heading>Filtres rapides</Ariakit.Heading>
                <Link className="reset" to="/catalogue" search={{}}>
                  Réinitialiser
                </Link>
              </div>
              <div className="quick-filters-wrapper">
                <section className="quick-filters-genres">
                  <div className="quick-filters-genres-heading">
                    <Ariakit.HeadingLevel>
                      <Ariakit.Heading>Genres</Ariakit.Heading>
                    </Ariakit.HeadingLevel>
                  </div>
                  <section className="quick-filters-genres-list">
                    {genreValues.map((genre) => {
                      const GenreIcon = genreIcons[genre];

                      return (
                        <Link
                          key={genre}
                          to="/catalogue"
                          replace={true}
                          search={(prev) => ({
                            ...prev,
                            genres: prev.genres?.includes(genre)
                              ? prev.genres.length === 1
                                ? undefined
                                : prev.genres.filter((g) => g !== genre)
                              : [...(prev.genres ?? []), genre],
                          })}
                          className={`tag tag-${genre.split(" ").join("-")} ${
                            (searchParams.genres ?? []).includes(genre)
                              ? "tag-active"
                              : ""
                          }`}
                        >
                          <GenreIcon /> {genre}
                        </Link>
                      );
                    })}
                  </section>
                </section>
                <section className="quick-filters-types">
                  <div className="quick-filters-types-heading">
                    <Ariakit.HeadingLevel>
                      <Ariakit.Heading>Types</Ariakit.Heading>
                    </Ariakit.HeadingLevel>
                  </div>
                  <div className="quick-filters-types-list">
                    {typeValues.map((type) => {
                      const typeEmoji = typeIcons[type];

                      return (
                        <Link
                          key={type}
                          to="/catalogue"
                          replace={true}
                          search={(prev) => ({
                            ...prev,
                            types: prev.types?.includes(type)
                              ? prev.types.length === 1
                                ? undefined
                                : prev.types.filter((t) => t !== type)
                              : [...(prev.types ?? []), type],
                          })}
                          className={`tag tag-${type} ${
                            (searchParams.types ?? []).includes(type)
                              ? "tag-active"
                              : ""
                          }`}
                        >
                          {typeEmoji} {type}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              </div>
            </section>
          </Ariakit.HeadingLevel>
        ) : (
          <Ariakit.PopoverProvider>
            <Ariakit.PopoverAnchor render={<header />} id="popover-trigger">
              <Ariakit.PopoverDisclosure className="menu-burger">
                <Ariakit.VisuallyHidden>Ouvrir le menu</Ariakit.VisuallyHidden>
                <FaBars size={24} className="burger" />
                <FaPlus size={24} className="close" />
              </Ariakit.PopoverDisclosure>
            </Ariakit.PopoverAnchor>

            <Ariakit.Popover
              overflowPadding={0}
              preventBodyScroll
              fitViewport
              fixed
              gutter={8}
              getPersistentElements={() =>
                document.querySelectorAll("#popover-trigger, .searchInput")
              }
              className="content"
            >
              <SearchSerie />
              <Ariakit.HeadingLevel>
                <div className="quick-filters">
                  <div className="quick-filters-heading">
                    <Ariakit.Heading>Filtres rapides</Ariakit.Heading>
                    <Link className="reset" to="/catalogue" search={{}}>
                      Réinitialiser
                    </Link>
                  </div>
                  <div className="quick-filters-wrapper">
                    <div className="quick-filters-genres">
                      <div className="quick-filters-genres-heading">
                        <Ariakit.HeadingLevel>
                          <Ariakit.Heading>Genres</Ariakit.Heading>
                          <Button
                            className="see-more"
                            onClick={() =>
                              toggleViewMoreGenres(!viewMoreGenres)
                            }
                          >
                            Voir {viewMoreGenres ? "moins" : "plus"}
                          </Button>
                        </Ariakit.HeadingLevel>
                      </div>
                      <section className="quick-filters-genres-list">
                        {viewMoreGenres
                          ? genreValues.map((genre) => {
                              const GenreIcon = genreIcons[genre];

                              return (
                                <Link
                                  key={genre}
                                  to="/catalogue"
                                  replace={true}
                                  search={(prev) => ({
                                    ...prev,
                                    genres: prev.genres?.includes(genre)
                                      ? prev.genres.length === 1
                                        ? undefined
                                        : prev.genres.filter((g) => g !== genre)
                                      : [...(prev.genres ?? []), genre],
                                  })}
                                  className={`tag tag-${genre
                                    .split(" ")
                                    .join("-")} ${
                                    (searchParams.genres ?? []).includes(genre)
                                      ? "tag-active"
                                      : ""
                                  }`}
                                >
                                  <GenreIcon /> {genre}
                                </Link>
                              );
                            })
                          : genreValues.slice(0, 6).map((genre) => {
                              const GenreIcon = genreIcons[genre];

                              return (
                                <Link
                                  key={genre}
                                  to="/catalogue"
                                  replace={true}
                                  search={(prev) => ({
                                    ...prev,
                                    genres: prev.genres?.includes(genre)
                                      ? prev.genres.length === 1
                                        ? undefined
                                        : prev.genres.filter((g) => g !== genre)
                                      : [...(prev.genres ?? []), genre],
                                  })}
                                  className={`tag tag-${genre
                                    .split(" ")
                                    .join("-")} ${
                                    (searchParams.genres ?? []).includes(genre)
                                      ? "tag-active"
                                      : ""
                                  }`}
                                >
                                  <GenreIcon /> {genre}
                                </Link>
                              );
                            })}
                      </section>
                    </div>
                    <div className="quick-filters-types">
                      <div className="quick-filters-types-heading">
                        <Ariakit.HeadingLevel>
                          <Ariakit.Heading>Types</Ariakit.Heading>
                        </Ariakit.HeadingLevel>
                      </div>
                      <div className="quick-filters-types-list">
                        {typeValues.map((type) => {
                          const typeEmoji = typeIcons[type];

                          return (
                            <Link
                              key={type}
                              to="/catalogue"
                              replace={true}
                              search={(prev) => ({
                                ...prev,
                                types: prev.types?.includes(type)
                                  ? prev.types.length === 1
                                    ? undefined
                                    : prev.types.filter((t) => t !== type)
                                  : [...(prev.types ?? []), type],
                              })}
                              className={`tag tag-${type} ${
                                (searchParams.types ?? []).includes(type)
                                  ? "tag-active"
                                  : ""
                              }`}
                            >
                              {typeEmoji} {type}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </Ariakit.HeadingLevel>
            </Ariakit.Popover>
          </Ariakit.PopoverProvider>
        )}

        <main className="catalogue">
          <Catalogue searchParams={searchParams} />
        </main>

        <Footer />
      </Ariakit.HeadingLevel>
    </div>
  );
}
