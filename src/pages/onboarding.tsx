import { Button, Card, CardContent, CardHeader, Checkbox } from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { useRouter } from "next/router";
import { onboardingAtom, searchFiltersAtom, userIdentityAtom } from "src/atoms";
import { ButtonLikeFormControlLabel } from "src/components/button-like-form-control-label";
import { Seo } from "src/components/seo";
import { Layout as AuthLayout } from "src/layouts/auth/classic-layout";
import { paths } from "src/paths";
import type { Page as PageType } from "src/types/page";

const ONBOARDING_CATEGORIES = [
  "Танцы",
  "Образование",
  "Творчество",
  "Игры",
  "Физическая активность",
  "Пение",
  "Рисование",
];

const Page: PageType = () => {
  const router = useRouter();
  const setUserIdentity = useSetAtom(userIdentityAtom);
  const setSearchFilters = useSetAtom(withImmer(searchFiltersAtom));
  const [onboarding, setOnboarding] = useAtom(onboardingAtom);

  const handleSkipClick = async () => {
    router.push(paths.index);
  };

  const handleCheckboxToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.name;
    setOnboarding((prev) => ({
      ...prev,
      categories: event.target.checked
        ? [...prev.categories, category]
        : prev.categories.filter((c) => c !== category),
    }));
  };

  return (
    <>
      <Seo title="Профиль" />
      <Card elevation={16}>
        <CardHeader
          sx={{ pb: 0 }}
          title="Выберите направления занятий, которые вам интересны"
        />
        <CardContent>
          {ONBOARDING_CATEGORIES.map((category) => (
            <ButtonLikeFormControlLabel
              key={category}
              control={
                <Checkbox
                  name={category}
                  checked={onboarding.categories.includes(category)}
                  onChange={handleCheckboxToggle}
                />
              }
              label={category}
            />
          ))}
          <Button
            fullWidth
            onClick={handleSkipClick}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Продолжить
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
