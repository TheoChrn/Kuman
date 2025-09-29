import * as Ariakit from "@ariakit/react";
import { statusLabelFrench } from "@kuman/db/enums";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import {
  PiBinocularsBold,
  PiBookmarkSimpleBold,
  PiHouseBold,
  PiMagnifyingGlassBold,
  PiUser,
} from "react-icons/pi";
import { useDebounce } from "~/hooks/use-debounce";
import { useDevice } from "~/hooks/use-device";
import { useTRPC } from "~/trpc/react";
import { statusIcons } from "~/utils/icons/statusIcons";

export const Route = createFileRoute("/_navigationLayout")({
  component: RouteComponent,
  loader: ({ context: { user } }) => ({ user: user }),
});

function RouteComponent() {
  const { user } = Route.useLoaderData();
  const { device } = useDevice();

  const trpc = useTRPC();
  const [currentValue, setCurrentValue] = useState("");
  const debouncedValue = useDebounce(currentValue, 300);

  const { data, isLoading } = useQuery(
    trpc.mangas.getAll.queryOptions(
      { search: debouncedValue },
      { placeholderData: keepPreviousData, enabled: !!debouncedValue }
    )
  );

  return (
    <>
      {device === "desktop" && (
        <nav className="nav">
          <div className="wrapper">
            <div></div>
            <div>
              <Link
                className="nav-link"
                to="/"
                activeProps={{ className: "active" }}
              >
                <Ariakit.VisuallyHidden>Accueil</Ariakit.VisuallyHidden>
                <PiHouseBold size={24} />
              </Link>
              <Link
                className="nav-link"
                to="/catalogue"
                activeProps={{ className: "active" }}
              >
                <Ariakit.VisuallyHidden>Catalogue</Ariakit.VisuallyHidden>
                <PiBinocularsBold size={24} />
              </Link>
              <Ariakit.ComboboxProvider>
                <div className="search-input">
                  <label>
                    <PiMagnifyingGlassBold size={24} />
                    <Ariakit.Combobox
                      onChange={(e) => setCurrentValue(e.target.value)}
                    />
                    <Ariakit.VisuallyHidden>
                      Rechercher une série
                    </Ariakit.VisuallyHidden>
                  </label>
                </div>

                <Ariakit.ComboboxPopover
                  gutter={12}
                  sameWidth
                  className="search-results"
                  shift={-48}
                >
                  {isLoading && "pending"}
                  {data?.length
                    ? data.map((serie) => {
                        const StatusIcon = statusIcons[serie.status];

                        return (
                          <Link
                            to="/$serieSlug/fiche"
                            params={{ serieSlug: serie.slug }}
                            key={serie.slug}
                          >
                            <img src={serie?.coverUrl ?? ""} />
                            <div>
                              <Ariakit.Heading className="heading">
                                {serie.title}
                              </Ariakit.Heading>
                              <Ariakit.HeadingLevel>
                                <Ariakit.Heading className="heading-2">
                                  <span>de</span> {serie.author}
                                </Ariakit.Heading>
                              </Ariakit.HeadingLevel>
                              <span className={`tag tag-${serie.status}`}>
                                <StatusIcon /> {statusLabelFrench[serie.status]}
                              </span>
                            </div>
                          </Link>
                        );
                      })
                    : currentValue.length
                      ? "Aucun résultat ne correspond à votre recherche"
                      : "Quelle série cherchez-vous ?"}
                </Ariakit.ComboboxPopover>
              </Ariakit.ComboboxProvider>
            </div>
            <div>
              {user ? (
                <>
                  <Link
                    className="nav-link"
                    to="/bookmarks"
                    activeProps={{ className: "active" }}
                  >
                    <Ariakit.VisuallyHidden>Favoris</Ariakit.VisuallyHidden>
                    <PiBookmarkSimpleBold size={24} />
                  </Link>
                  <Link className="nav-link" to="/profile">
                    <Ariakit.VisuallyHidden>Profile</Ariakit.VisuallyHidden>
                    <img
                      src="/mock_profile.png"
                      alt="Photo de profil"
                      className="logo"
                      height={24}
                      width={24}
                    />
                  </Link>
                </>
              ) : (
                <Link className="nav-link" to="/auth/login">
                  <Ariakit.VisuallyHidden>Connexion</Ariakit.VisuallyHidden>
                  <PiUser size={24} />
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
      <div id="app-wrapper">
        <Outlet />
      </div>
      {device !== "desktop" && (
        <nav className="nav">
          <Link
            className="nav-link"
            to="/"
            activeProps={{ className: "active" }}
          >
            <Ariakit.VisuallyHidden>Accueil</Ariakit.VisuallyHidden>
            <PiHouseBold size={24} />
          </Link>
          <Link
            className="nav-link"
            to="/catalogue"
            activeProps={{ className: "active" }}
          >
            <Ariakit.VisuallyHidden>Catalogue</Ariakit.VisuallyHidden>
            <PiBinocularsBold size={24} />
          </Link>
          {user ? (
            <>
              <Link
                className="nav-link"
                to="/bookmarks"
                activeProps={{ className: "active" }}
              >
                <Ariakit.VisuallyHidden>Favoris</Ariakit.VisuallyHidden>
                <PiBookmarkSimpleBold size={24} />
              </Link>
              <Link className="nav-link" to="/profile">
                <Ariakit.VisuallyHidden>Profile</Ariakit.VisuallyHidden>
                <img
                  src="/mock_profile.png"
                  alt="Photo de profil"
                  className="logo"
                  height={24}
                  width={24}
                />
              </Link>
            </>
          ) : (
            <Link className="nav-link" to="/auth/login">
              <Ariakit.VisuallyHidden>Connexion</Ariakit.VisuallyHidden>
              <PiUser size={24} />
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
