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
  styled,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import CalendarIcon from "@untitled-ui/icons-react/build/esm/Calendar";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import MarkerPin04Icon from "@untitled-ui/icons-react/build/esm/MarkerPin04";
import Image from "next/image";
import NextLink from "next/link";
import { FC, Fragment } from "react";
import type { Activity, ActivityVariant } from "src/types/activity";
import { objectEntries } from "ts-extras";
import {
  formatActivityTime,
  formatActivityTitle,
  formatArea,
  formatWeekday,
} from "../../utils/formatting";

const GAP = 1;
const VARIANTS_DISPLAYED = 2;
const IMAGE_WIDTH = 200;
const IMAGE_ASPECT_RATIO = 2 / 3;

interface ActivityCardProps {
  activity?: Activity;
}

export const ActivityCard: FC<ActivityCardProps> = (props) => {
  const { activity, ...other } = props;

  const variants = activity?.variants;
  const showShowMore = variants && variants.length > VARIANTS_DISPLAYED;

  return (
    <Stack
      component={Card}
      direction="row"
      /* {...(activity?.tags.promo && {
        border: 2,
        borderColor: "#fdc83080",
      })} */
      {...other}
    >
      {activity ? (
        <ActivityCardImage
          src={`/assets/activities/${formatActivityTitle(
            activity.category3,
          ).replaceAll("/", "_")}.png`}
          width={IMAGE_WIDTH}
          height={IMAGE_WIDTH / IMAGE_ASPECT_RATIO}
          alt={activity.category3}
        />
      ) : (
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={200}
          height="auto"
        />
      )}
      <CardContent
        sx={{
          width: "100%",
          px: 4,
          py: 4,
          "&:last-child": { pb: showShowMore ? GAP : 4 },
        }}
      >
        <Stack spacing={GAP}>
          <Grid container gap={1} rowGap={0}>
            {/* Title */}
            <Grid xs={12}>
              <Link
                variant="h6"
                color="text.primary"
                component={NextLink}
                href={"https://www.mos.ru/dolgoletie-app-ts/#"}
              >
                {activity ? (
                  formatActivityTitle(activity.category3)
                ) : (
                  <Skeleton animation="wave" width="30ch" />
                )}
              </Link>
            </Grid>

            {/* Chips */}
            {activity ? (
              <>
                {activity.tags.promo && (
                  <Grid>
                    <PromoChip />
                  </Grid>
                )}
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
                    <ForMindChip />
                  </Grid>
                )}
                {activity.tags.category === "soul" && (
                  <Grid>
                    <ForSoulChip />
                  </Grid>
                )}
                {activity.tags.category === "body" && (
                  <Grid>
                    <ForBodyChip />
                  </Grid>
                )}
                {activity.tags.smallGroups && (
                  <Grid>
                    <GenericChip label="небольшие группы" />
                  </Grid>
                )}
                {activity.tags.nextHouse && (
                  <Grid>
                    <GenericChip label="в соседнем доме" />
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

          {variants ? (
            <>
              {variants.slice(0, 2).map((variant, idx) => (
                <Fragment key={variant.id}>
                  {idx > 0 && <Divider sx={{ my: 2 }} />}
                  <ActivityCardVariant
                    variant={variant}
                    primary={idx === 0}
                    online={activity.tags.online}
                  />
                </Fragment>
              ))}
              {variants.length > 2 && (
                <>
                  <Divider />
                  <Button
                    color="inherit"
                    component={NextLink}
                    href={"https://www.mos.ru/dolgoletie-app-ts/#"}
                    sx={{
                      justifyContent: "flex-start",
                    }}
                    endIcon={
                      <SvgIcon>
                        <ChevronDownIcon />
                      </SvgIcon>
                    }
                  >
                    Ещё группы
                  </Button>
                </>
              )}
            </>
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
            {objectEntries(variant.timetable)
              .filter(([, value]) => value && value !== "нет")
              .map(([key, value]) => (
                <Stack
                  key={key}
                  height={24}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography noWrap variant="overline">
                    {formatWeekday(key)} {formatActivityTime(value!)}
                  </Typography>
                </Stack>
              ))}
          </Stack>
        </Stack>
      </Stack>
      <Box flexGrow={1} />
      <Button
        component={NextLink}
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

const ActivityCardImage = styled(Image)(({ theme }) => ({
  objectFit: "cover",
  minWidth: IMAGE_WIDTH,
}));

const GenericChip = (props: { label: string }) => {
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

const ForBodyChip = () => {
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

const ForSoulChip = () => {
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

const ForMindChip = () => {
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

const PromoChip = () => {
  return (
    <Chip
      label="промо"
      sx={{
        color: "black",
        backgroundImage: "linear-gradient(to right, #fdc830, #f37335)",
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
