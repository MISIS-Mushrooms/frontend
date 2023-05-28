import { CardContent, Checkbox, Unstable_Grid2 as Grid } from "@mui/material";
import { useAtom } from "jotai";
import { searchFiltersAtom, userIdentityAtom } from "src/atoms";
import { ButtonLikeFormControlLabel } from "src/components/button-like-form-control-label";
import { useMounted } from "src/hooks/use-mounted";
import { assert } from "src/utils/assert";
import { formatArea } from "src/utils/format-area";

export const ActivityLocationForm = () => {
  const isMounted = useMounted();
  const [userIdentity] = useAtom(userIdentityAtom);
  const [searchFilters, setSearchFilters] = useAtom(searchFiltersAtom);

  assert(userIdentity);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const area = event.target.name;
    setSearchFilters((prev) => ({
      ...prev,
      areas: event.target.checked
        ? [...prev.areas, area]
        : prev.areas.filter((id) => id !== area),
    }));
  };

  return (
    <Grid
      container
      component={CardContent}
      justifyContent={{ xs: "center", sm: "start" }}
      spacing={{ xs: 0 }}
      sx={{ pb: 0 }}
      height={400}
      overflow="auto"
    >
      {userIdentity.areas.map((area) => (
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
