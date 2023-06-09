import {
  alpha,
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { useAtomValue } from "jotai";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { searchResultsAtom, userIdentityAtom } from "src/atoms";
import { Seo } from "src/components/seo";
import { TranslucentThemeProvider } from "src/contexts/translucent-theme-provider";
import { MainLayout } from "src/layouts/main";
import { paths } from "src/paths";
import { ActivityCard } from "src/sections/activities/activity-card";
import { ActivityListSearch } from "src/sections/activities/activity-list-search";
import type { Page as PageType } from "src/types/page";
import { assert } from "src/utils/assert";
import { formatPersonName } from "src/utils/formatting";

const Page: PageType = () => {
  const userIdentity = useAtomValue(userIdentityAtom);
  const activities = useAtomValue(searchResultsAtom);

  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    if (activities.state === "hasData") {
      setFirstLoading(false);
    }
  }, [activities.state]);

  assert(userIdentity);
  const { firstName, middleName } = userIdentity;

  return (
    <>
      <Seo title="Занятия" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="lg">
          {userIdentity.type !== "authenticated" ? (
            <ProfileBanner />
          ) : (
            <Typography variant="h6">
              {formatPersonName(null, firstName, middleName)},{" "}
              {firstLoading ? "сейчас мы найдём " : "вот "}
              занятия, которые могут вам понравиться
            </Typography>
          )}
          <Stack spacing={4} sx={{ mt: 4 }}>
            <Box
              component="header"
              sx={{
                position: "sticky",
                top: (theme) => theme.spacing(4),
                zIndex: 1,
              }}
            >
              <TranslucentThemeProvider>
                <ActivityListSearch
                  sx={{
                    backdropFilter: "blur(10px)",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: (theme) =>
                      // @ts-expect-error
                      alpha(theme.palette.text.primary, 0.25),
                  }}
                />
              </TranslucentThemeProvider>
            </Box>
            <Stack px={2} spacing={4}>
              {activities.state === "hasData" &&
                activities.data?.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              {activities.state === "loading" && (
                <>
                  <ActivityCard />
                  <ActivityCard />
                  <ActivityCard />
                  <ActivityCard />
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Page;

function ProfileBanner() {
  return (
    <Grid
      alignItems="center"
      container
      sx={{
        backgroundImage: (theme) =>
          `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darkest} 65%)`,
        borderRadius: 1,
        color: "primary.contrastText",
        p: 4,
        py: { sm: 8 },
      }}
    >
      <Grid xs={12} sm={7}>
        <Typography variant="h5">
          Укажите ваше имя и дату рождения, чтобы мы могли подобрать занятия,
          которые вам понравятся
        </Typography>
      </Grid>
      <Grid container xs={12} sm={5} justifyContent="center">
        <Button
          color="primary"
          component={NextLink}
          href={paths.login}
          size="large"
          variant="contained"
          sx={{ px: 5, py: 2, mt: { xs: 2, sm: 0 } }}
        >
          Указать
        </Button>
      </Grid>
    </Grid>
  );
}
