import {
  Button,
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
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import { useAtom } from "jotai";
import { throttle } from "radash";
import { FC, useMemo, useState } from "react";
import { searchFiltersAtom } from "src/atoms";
import { ButtonLikeFormControlLabel } from "../../components/button-like-form-control-label";
import { ActivityFriendProfileForm } from "./activity-friend-profile-form";
import { ActivityLocationForm } from "./activity-location-form";

export const ActivityListSearch: FC<{ sx?: SxProps }> = (props) => {
  const [searchFilters, setSearchFilters] = useAtom(searchFiltersAtom);
  const [query, setQuery] = useState(searchFilters.query);
  const [openForm, setOpenForm] = useState<null | "friends" | "location">(null);

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

  const handleFriendsClick = () => {
    if (openForm === "friends") {
      setOpenForm(null);
    } else {
      setOpenForm("friends");
    }
  };
  const handleLocationClick = () => {
    if (openForm === "location") {
      setOpenForm(null);
    } else {
      setOpenForm("location");
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
        spacing={{ xs: 1, sm: 2 }}
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
          <Button
            color="inherit"
            onClick={handleFriendsClick}
            endIcon={
              <SvgIcon>
                <ChevronDownIcon />
              </SvgIcon>
            }
          >
            Хочу посещать вместе с...
          </Button>
        </Grid>
        <Grid>
          <Button
            color="inherit"
            onClick={handleLocationClick}
            endIcon={
              <SvgIcon>
                <ChevronDownIcon />
              </SvgIcon>
            }
          >
            Район
          </Button>
        </Grid>
      </Grid>
      {openForm !== null && <Divider />}
      {openForm === "friends" && <ActivityFriendProfileForm />}
      {openForm === "location" && <ActivityLocationForm />}
    </Card>
  );
};
