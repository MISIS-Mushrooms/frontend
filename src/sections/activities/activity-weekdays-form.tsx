import { Checkbox, Unstable_Grid2 as Grid } from "@mui/material";
import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { searchFiltersAtom } from "src/atoms";
import { ButtonLikeFormControlLabel } from "src/components/button-like-form-control-label";
import { Weekday, WEEKDAYS } from "src/types/weekdays";
import { formatWeekday } from "src/utils/formatting";

export const ActivityWeekdaysForm = () => {
  const [searchFilters, setSearchFilters] = useAtom(
    withImmer(searchFiltersAtom),
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const weekday = event.target.name as Weekday;
    setSearchFilters((filters) => {
      filters.days[weekday] = event.target.checked;
    });
  };

  return (
    <Grid container p={1} justifyContent="center">
      {WEEKDAYS.map((weekday) => (
        <Grid key={weekday}>
          <ButtonLikeFormControlLabel
            control={
              <Checkbox
                name={weekday}
                checked={searchFilters.days[weekday]}
                onChange={handleChange}
              />
            }
            label={formatWeekday(weekday, true)}
          />
        </Grid>
      ))}
    </Grid>
  );
};
