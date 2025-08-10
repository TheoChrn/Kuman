import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { PiBinocularsBold } from "react-icons/pi";

export const Route = createFileRoute("/_navigationPathlessLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
      <nav className="mobile-nav">
        <Link to="/catalogue" activeProps={{ className: "active" }}>
          <PiBinocularsBold size={24} />
          Explorer
        </Link>
      </nav>
    </>
  );
}
