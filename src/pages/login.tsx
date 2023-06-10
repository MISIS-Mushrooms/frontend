import { Card, CardContent, CardHeader } from "@mui/material";
import { useSetAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { useResetAtom } from "jotai/utils";
import { useRouter } from "next/router";
import {
  friendIdentitiesAtom,
  onboardingAtom,
  searchFiltersAtom,
  userIdentityAtom,
} from "src/atoms";
import { Seo } from "src/components/seo";
import { Layout as AuthLayout } from "src/layouts/auth/classic-layout";
import { paths } from "src/paths";
import { IdentityForm } from "src/sections/identity-form";
import type { Page as PageType } from "src/types/page";
import { UserIdentity } from "src/types/user-identity";

const Page: PageType = () => {
  const router = useRouter();
  const setUserIdentity = useSetAtom(userIdentityAtom);
  const resetOnboarding = useResetAtom(onboardingAtom);
  const resetFriendIdentities = useResetAtom(friendIdentitiesAtom);
  const resetSearchFilters = useResetAtom(searchFiltersAtom);
  const setSearchFilters = useSetAtom(withImmer(searchFiltersAtom));

  router.prefetch(paths.index);
  router.prefetch(paths.onboarding);

  const handleIdentify = (identity: UserIdentity, healthProblems: boolean) => {
    resetOnboarding();
    resetFriendIdentities();
    resetSearchFilters();
    setSearchFilters((filters) => {
      filters.healthProblems = healthProblems;
    });
    setUserIdentity(identity);

    if (identity.needOnboarding) {
      router.push(paths.onboarding);
    } else {
      router.push(paths.index);
    }
  };

  return (
    <>
      <Seo title="Профиль" />
      <Card elevation={16}>
        <CardHeader
          sx={{ pb: 0 }}
          title="Введите ваши данные, чтобы мы подобрали занятия, которые вам понравятся"
        />
        <CardContent>
          <IdentityForm onIdentify={handleIdentify} allowSkip />
        </CardContent>
      </Card>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
