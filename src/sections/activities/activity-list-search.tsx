import {
  Button,
  ButtonProps,
  Card,
  Checkbox,
  Divider,
  Input,
  SvgIcon,
  SxProps,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import ChevronUpIcon from "@untitled-ui/icons-react/build/esm/ChevronUp";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import UserIcon from "@untitled-ui/icons-react/build/esm/User02";
import { useAtom, useSetAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { throttle } from "radash";
import { FC, ReactNode, useMemo, useState } from "react";
import { addFriendDialogOpenAtom, searchFiltersAtom } from "src/atoms";
import { formatWeekdayList } from "src/utils/formatting";
import { pluralizeRussianNoun } from "src/utils/pluralize-russian";
import { objectEntries } from "ts-extras";
import { ButtonLikeFormControlLabel } from "../../components/button-like-form-control-label";
import { ActivityFriendProfileForm } from "./activity-friend-profile-form";
import { ActivityLocationForm } from "./activity-location-form";
import { ActivityWeekdaysForm } from "./activity-weekdays-form";

export const ActivityListSearch: FC<{ sx?: SxProps }> = (props) => {
  const [searchFilters, setSearchFilters] = useAtom(
    withImmer(searchFiltersAtom),
  );
  const [query, setQuery] = useState(searchFilters.query);

  const setAddFriendDialogOpen = useSetAtom(addFriendDialogOpenAtom);
  const [openForm, setOpenForm] = useState<
    null | "weekdays" | "friends" | "location"
  >(null);

  const peopleCount =
    searchFilters.friendIds.length + (searchFilters.withGrandson ? 1 : 0);

  const weekdayList = objectEntries(searchFilters.days)
    .filter(([_, enabled]) => enabled)
    .map(([weekday]) => weekday);

  const areaCount = searchFilters.areas.length;

  const updateSearchFilterQuery = useMemo(
    () =>
      throttle(
        { interval: 2000 },
        (event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchFilters((prev) => ({ ...prev, query: event.target.value }));
        },
      ),
    [setSearchFilters],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    updateSearchFilterQuery(event);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [event.target.name]: event.target.checked,
      },
    }));
  };

  const handlePreferOnlineChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchFilters((prev) => ({
      ...prev,
      preferOnline: event.target.checked,
    }));
  };

  const toggleForm = (form: "weekdays" | "friends" | "location") => {
    if (openForm === form) {
      setOpenForm(null);
    } else {
      setOpenForm(form);
    }
  };

  return (
    <Card {...props}>
      <Input
        startAdornment={
          <SvgIcon sx={{ mr: 2 }}>
            <SearchMdIcon />
          </SvgIcon>
        }
        fullWidth
        disableUnderline
        placeholder="Поиск по занятиям"
        value={query}
        onChange={handleQueryChange}
        sx={{ p: 2 }}
      />
      <Divider />
      <Grid
        container
        justifyContent={{ xs: "center", sm: "start" }}
        spacing={{ xs: 1, sm: 1.5 }}
        sx={{ px: 2, py: 1, userSelect: "none" }}
      >
        <Grid>
          <ButtonLikeFormControlLabel
            name="soul"
            control={
              <Checkbox
                color="success"
                checked={searchFilters.categories.soul}
                onChange={handleCategoryChange}
              />
            }
            label={
              <Typography
                sx={{
                  px: "2px",
                  borderRadius: 1,
                  backgroundColor: (theme) => theme.palette.success.alpha8,
                }}
              >
                Для души
              </Typography>
            }
          />
          <ButtonLikeFormControlLabel
            name="mind"
            control={
              <Checkbox
                color="warning"
                checked={searchFilters.categories.mind}
                onChange={handleCategoryChange}
              />
            }
            label={
              <Typography
                sx={{
                  px: "2px",
                  borderRadius: 1,
                  backgroundColor: (theme) => theme.palette.warning.alpha8,
                }}
              >
                Для ума
              </Typography>
            }
          />
          <ButtonLikeFormControlLabel
            name="body"
            control={
              <Checkbox
                color="error"
                checked={searchFilters.categories.body}
                onChange={handleCategoryChange}
              />
            }
            label={
              <Typography
                sx={{
                  px: "2px",
                  borderRadius: 1,
                  backgroundColor: (theme) => theme.palette.error.alpha8,
                }}
              >
                Для тела
              </Typography>
            }
          />
        </Grid>
        <Grid>
          <ButtonLikeFormControlLabel
            control={
              <Checkbox
                value={searchFilters.preferOnline}
                onChange={handlePreferOnlineChange}
              />
            }
            label="Предпочитаю онлайн"
          />
        </Grid>
        <Grid>
          <DropdownButton
            open={openForm === "friends"}
            onClick={() => toggleForm("friends")}
          >
            Вместе с{" "}
            {peopleCount ? (
              <>
                <SvgIcon fontSize="small" sx={{ ml: 0.5 }}>
                  <UserIcon />
                </SvgIcon>{" "}
                {peopleCount}
              </>
            ) : (
              "..."
            )}
          </DropdownButton>
        </Grid>
        <Grid>
          <DropdownButton
            open={openForm === "weekdays"}
            onClick={() => toggleForm("weekdays")}
          >
            {formatWeekdayList(weekdayList) ?? "Дни недели"}
          </DropdownButton>
        </Grid>
        <Grid>
          <DropdownButton
            open={openForm === "location"}
            onClick={() => toggleForm("location")}
          >
            {areaCount > 0
              ? `${areaCount} район${pluralizeRussianNoun(
                  areaCount,
                  "",
                  "а",
                  "ов",
                )}`
              : `Районы`}
          </DropdownButton>
        </Grid>
      </Grid>
      {openForm !== null && <Divider />}
      {openForm === "weekdays" && <ActivityWeekdaysForm />}
      {openForm === "friends" && <ActivityFriendProfileForm />}
      {openForm === "location" && <ActivityLocationForm />}
    </Card>
  );
};

type DropdownButtonProps = ButtonProps & {
  open: boolean;
  onClick: () => void;
  children: ReactNode;
};

const DropdownButton: FC<DropdownButtonProps> = ({
  open,
  onClick,
  children,
}) => {
  return (
    <Button
      color="inherit"
      onClick={onClick}
      endIcon={
        <SvgIcon>{open ? <ChevronUpIcon /> : <ChevronDownIcon />}</SvgIcon>
      }
    >
      {children}
    </Button>
  );
};
