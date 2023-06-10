import { Checkbox, Unstable_Grid2 as Grid } from "@mui/material";
import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { useMemo } from "react";
import { searchFiltersAtom, userIdentityAtom } from "src/atoms";
import { ButtonLikeFormControlLabel } from "src/components/button-like-form-control-label";
import { assert } from "src/utils/assert";
import { formatArea } from "src/utils/formatting";

export const ActivityLocationForm = () => {
  const [userIdentity] = useAtom(userIdentityAtom);
  const [searchFilters, setSearchFilters] = useAtom(
    withImmer(searchFiltersAtom),
  );

  assert(userIdentity);

  const sortedAreas = useMemo(
    () => [...userIdentity.areas].sort((a, b) => a.localeCompare(b)),
    [userIdentity.areas],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const area = event.target.name;
    setSearchFilters((filters) => {
      filters.areas = event.target.checked
        ? [...filters.areas, area]
        : filters.areas.filter((id) => id !== area);
    });
  };

  return (
    <Grid
      container
      p={1}
      maxHeight={200}
      overflow="auto"
      justifyContent="center"
    >
      {sortedAreas.map((area) => (
        <Grid key={area}>
          <ButtonLikeFormControlLabel
            control={
              <Checkbox
                name={area}
                checked={searchFilters.areas.includes(area)}
                onChange={handleChange}
              />
            }
            label={formatArea([area])}
          />
        </Grid>
      ))}
    </Grid>
  );
};
