import {
  createFileRoute,
  Link,
  Outlet,
  useLoaderData,
} from "@tanstack/react-router";
import {
  PiBinocularsBold,
  PiBookmarkSimpleBold,
  PiHouseBold,
  PiUser,
} from "react-icons/pi";

export const Route = createFileRoute("/_navigationLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useLoaderData({ from: "__root__" });

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
        {!!user ? (
          <Link to="/profile">
            <PiUser size={24} />
            Profile
          </Link>
        ) : (
          <Link to="/auth/login">
            <PiUser size={24} />
            Connexion
          </Link>
        )}
        <Link to="/catalogue" activeProps={{ className: "active" }}>
          <PiBinocularsBold size={24} />
          Explorer
        </Link>
        <Link to="/bookmarks" activeProps={{ className: "active" }}>
          <PiBookmarkSimpleBold size={24} />
          Favoris
        </Link>
      </nav>
    </>
  );
}
