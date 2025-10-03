import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link, rootRouteId, useMatch, useRouter } from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import { Button } from "~/components/ui/buttons/button";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  return (
    <div className="error-component">
      <div>
        <span className="heading-1">
          {error instanceof TRPCClientError && error.data?.httpStatus}
        </span>
        <p className="heading-5">{error.message}</p>
      </div>
      <div className="button-actions">
        <Button
          className="button button-outline"
          onClick={() => {
            router.invalidate();
          }}
        >
          Try Again
        </Button>
        {isRoot ? (
          <Link to="/" className="button primary">
            Home
          </Link>
        ) : (
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
            className="button button-primary"
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  );
}
