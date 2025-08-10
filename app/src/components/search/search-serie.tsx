import * as Ariakit from "@ariakit/react";
import { statusLabelFrench } from "@kuman/db/enums";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { PiMagnifyingGlass } from "react-icons/pi";
import { useDebounce } from "~/hooks/use-debounce";

import { useTRPC } from "~/trpc/react";
import { statusIcons } from "~/utils/icons/statusIcons";

export default function SearchSerie() {
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
      <Ariakit.Portal
        className="search-input"
        portalElement={() => document.getElementById("popover-trigger")}
      >
        <label>
          <Ariakit.VisuallyHidden>Rechercher un manga</Ariakit.VisuallyHidden>
          <PiMagnifyingGlass />
          <input
            id="seach"
            name="serie"
            type="search"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="Rechercher une série"
          />
        </label>
      </Ariakit.Portal>
      {isLoading && "pending"}
      {!!data?.length && currentValue && (
        <Ariakit.HeadingLevel>
          <section className="search-results">
            {data.map((serie) => {
              const StatusIcon = statusIcons[serie.status];

              return (
                <Link to="/$serieSlug/fiche" params={{ serieSlug: serie.slug }}>
                  <img src={serie?.coverUrl ?? ""} />
                  <div>
                    <Ariakit.Heading>{serie.title}</Ariakit.Heading>
                    <Ariakit.HeadingLevel>
                      <Ariakit.Heading>
                        <span>de</span> {serie.author}
                      </Ariakit.Heading>
                    </Ariakit.HeadingLevel>
                    <span className={`tag tag-${serie.status}`}>
                      <StatusIcon /> {statusLabelFrench[serie.status]}
                    </span>
                  </div>
                </Link>
              );
            })}
            <Ariakit.Separator />
          </section>
        </Ariakit.HeadingLevel>
      )}
    </>
  );
}
