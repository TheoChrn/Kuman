import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  PiBinocularsBold,
  PiBookmarkSimpleBold,
  PiHouseBold,
  PiSpinner,
  PiUser,
  PiUserBold,
} from "react-icons/pi";

export const Route = createFileRoute("/_navigationLayout")({
  component: RouteComponent,
  loader: ({ context: { user } }) => ({ user: user }),
});

function RouteComponent() {
  const { user } = Route.useLoaderData();

  return (
    <>
      <div id="app-wrapper">
        <Outlet />
      </div>
      <nav className="mobile-nav">
        <Link to="/" activeProps={{ className: "active" }}>
          <PiHouseBold size={24} />
          Accueil
        </Link>
        <Link to="/catalogue" activeProps={{ className: "active" }}>
          <PiBinocularsBold size={24} />
          Explorer
        </Link>
        {user ? (
          <>
            <Link to="/bookmarks" activeProps={{ className: "active" }}>
              <PiBookmarkSimpleBold size={24} />
              Favoris
            </Link>
            <Link to="/profile">
              <PiUserBold size={24} />
              Profile
            </Link>
          </>
        ) : (
          <Link to="/auth/login">
            <PiUser size={24} />
            Connexion
          </Link>
        )}
      </nav>
    </>
  );
}
