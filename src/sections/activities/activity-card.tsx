import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Link,
  Skeleton,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import CalendarIcon from "@untitled-ui/icons-react/build/esm/Calendar";
import MarkerPin04Icon from "@untitled-ui/icons-react/build/esm/MarkerPin04";
import Image from "next/image";
import { FC, Fragment } from "react";
import { RouterLink } from "src/components/router-link";
import type { Activity, ActivityVariant } from "src/types/activity";
import { formatArea } from "../../utils/format-area";

interface ActivityCardProps {
  activity?: Activity;
}

export const ActivityCard: FC<ActivityCardProps> = (props) => {
  const { activity, ...other } = props;

  return (
    <Stack component={Card} direction="row" {...other}>
      {activity ? (
        <Image
          src={`/assets/activities/${formatTitle(activity.category3).replaceAll(
            "/",
            "_",
          )}.png`}
          width={200}
          height={100}
          style={{ objectFit: "cover" }}
          alt={activity.category3}
        />
      ) : (
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={250}
          height="auto"
        />
      )}
      <CardContent
        sx={{ width: "100%", px: 4, py: 4, "&:last-child": { pb: 4 } }}
      >
        <Stack spacing={1}>
          <Grid container gap={1} rowGap={0}>
            {/* Title */}
            <Grid xs={12}>
              <Link
                variant="h6"
                color="text.primary"
                component={RouterLink}
                href={"https://www.mos.ru/dolgoletie-app-ts/#"}
              >
                {activity ? (
                  formatTitle(activity.category3)
                ) : (
                  <Skeleton animation="wave" width="30ch" />
                )}
              </Link>
            </Grid>

            {/* Chips */}
            {activity ? (
              <>
                {activity.tags.new && (
                  <Grid>
                    <NewChip />
                  </Grid>
                )}
                {activity.tags.online && (
                  <Grid>
                    <OnlineChip />
                  </Grid>
                )}
                {activity.tags.category === "mind" && (
                  <Grid>
                    <MindChip />
                  </Grid>
                )}
                {activity.tags.category === "soul" && (
                  <Grid>
                    <SoulChip />
                  </Grid>
                )}
                {activity.tags.category === "body" && (
                  <Grid>
                    <BodyChip />
                  </Grid>
                )}
                {activity.tags.smallGroups && (
                  <Grid>
                    <NeutralChip label="небольшие группы" />
                  </Grid>
                )}
                {activity.tags.nextHouse && (
                  <Grid>
                    <NeutralChip label="в соседнем доме" />
                  </Grid>
                )}
              </>
            ) : (
              <>
                <Skeleton animation="wave" width={50} height={30} />
                <Skeleton animation="wave" width={90} height={30} />
                <Skeleton animation="wave" width={70} height={30} />
              </>
            )}
          </Grid>

          {/* Description */}
          <Typography variant="body2" maxWidth="60ch">
            {activity ? (
              activity.description
            ) : (
              <>
                <Skeleton animation="wave" />
                <Skeleton animation="wave" width="25ch" />
              </>
            )}
          </Typography>

          {activity ? (
            activity.variants.slice(0, 2).map((variant, idx) => (
              <Fragment key={variant.id}>
                {idx > 0 && <Divider sx={{ my: 2 }} />}
                <ActivityCardVariant
                  variant={variant}
                  primary={idx === 0}
                  online={activity.tags.online}
                />
              </Fragment>
            ))
          ) : (
            <Skeleton animation="wave" width={200} height={85} />
          )}
        </Stack>
      </CardContent>
    </Stack>
  );
};

type ActivityCardVariantProps = {
  variant: ActivityVariant;
  primary: boolean;
  online: boolean;
};

const ActivityCardVariant: FC<ActivityCardVariantProps> = ({
  variant,
  primary,
  online,
}) => {
  return (
    <Grid container alignItems="start">
      <Stack>
        {!online && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <SvgIcon>
              <MarkerPin04Icon />
            </SvgIcon>
            <Typography noWrap variant="overline">
              {formatArea(variant.area, variant.distance)}
            </Typography>
          </Stack>
        )}
        <Stack
          direction="row"
          spacing={1}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          <SvgIcon sx={{ height: 24 }}>
            <CalendarIcon />
          </SvgIcon>
          <Stack>
            {Object.entries(variant.timetable)
              .filter(([, value]) => value !== "нет")
              .map(([key, value]) => (
                <Stack
                  key={key}
                  height={24}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography noWrap variant="overline">
                    {formatDay(key)} {formatTime(value)}
                  </Typography>
                </Stack>
              ))}
          </Stack>
        </Stack>
      </Stack>
      <Box flexGrow={1} />
      <Button
        component={RouterLink}
        href={"https://www.mos.ru/dolgoletie-app-ts/#"}
        size="large"
        variant={primary ? "contained" : "outlined"}
        sx={{ mt: online ? 0 : 2 }}
      >
        Записаться
      </Button>
    </Grid>
  );
};

const NeutralChip = (props: { label: string }) => {
  return (
    <Chip
      {...props}
      sx={{
        backgroundImage: (theme) =>
          `linear-gradient(90deg, ${theme.palette.neutral[200]} 0%, ${theme.palette.neutral[100]} 100%)`,
        color: (theme) => theme.palette.neutral[800],
      }}
      size="small"
    />
  );
};

const BodyChip = () => {
  return (
    <Chip
      label="для тела"
      sx={{
        backgroundImage: (theme) =>
          `linear-gradient(90deg, ${theme.palette.error.light} 0%, ${theme.palette.error.lightest} 100%)`,
        color: "error.darkest",
      }}
      size="small"
    />
  );
};

const SoulChip = () => {
  return (
    <Chip
      label="для души"
      sx={{
        backgroundColor: "success.lightest",
        backgroundImage: (theme) =>
          `linear-gradient(90deg, ${theme.palette.success.light} 0%, ${theme.palette.success.lightest} 100%)`,
        color: "success.darkest",
      }}
      size="small"
    />
  );
};

const MindChip = () => {
  return (
    <Chip
      label="для ума"
      sx={{
        backgroundImage: (theme) =>
          `linear-gradient(90deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.lightest} 100%)`,
        color: "warning.darkest",
      }}
      size="small"
    />
  );
};

const OnlineChip = () => {
  return (
    <Chip
      label="онлайн"
      sx={{
        backgroundColor: "success.lightest",
        color: "success.darkest",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "success.light",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='smallGrid' width='8' height='8' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 8 0 L 0 0 0 8' fill='none' stroke='darkgreen' opacity='0.5' stroke-width='0.5'/%3E%3C/pattern%3E%3Cpattern id='grid' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Crect width='80' height='80' fill='url(%23smallGrid)'/%3E%3Cpath d='M 80 0 L 0 0 0 80' fill='none' stroke='transparent' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E\")",
        backgroundPositionY: 3,
      }}
      size="small"
    />
  );
};

const NewChip = () => {
  return (
    <Chip
      label="новое"
      sx={{
        backgroundImage: (theme) =>
          `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.lightest} 100%)`,
        color: "primary.darkest",
      }}
      size="small"
    />
  );
};

function formatDay(day: string) {
  if (day === "mon") {
    return "Пн";
  } else if (day === "tue") {
    return "Вт";
  } else if (day === "wed") {
    return "Ср";
  } else if (day === "thu") {
    return "Чт";
  } else if (day === "fri") {
    return "Пт";
  } else if (day === "sat") {
    return "Сб";
  } else if (day === "sun") {
    return "Вс";
  }
  return day;
}

function formatTime(time: string) {
  return time.replaceAll(" ", "").replaceAll(":", "∶").replaceAll("-", "–");
}

function formatTitle(title: string) {
  return title.replace("ОНЛАЙН ", "");
}
