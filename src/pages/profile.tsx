import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { format as formatDate } from "date-fns";
import { useFormik } from "formik";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { activitiesApi } from "src/api/activities";
import { searchFiltersAtom, userIdentityAtom } from "src/atoms";
import { Seo } from "src/components/seo";
import { WarningStripes } from "src/components/warning-stripes";
import Calendar from "src/icons/untitled-ui/duocolor/calendar";
import { Layout as AuthLayout } from "src/layouts/auth/classic-layout";
import { paths } from "src/paths";
import type { Page as PageType } from "src/types/page";
import * as Yup from "yup";

interface Values {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: Date | null;
  healthProblems: boolean;
  submit: null;
}

const initialValues: Values = {
  lastName: "",
  firstName: "",
  middleName: "",
  dateOfBirth: null,
  healthProblems: false,
  submit: null,
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("Введите ваше имя"),
  lastName: Yup.string().required("Введите вашу фамилию"),
  middleName: Yup.string().nullable(),
  dateOfBirth: Yup.date().required("Укажите вашу дату рождения"),
  healthProblems: Yup.boolean(),
});

const Page: PageType = () => {
  const router = useRouter();
  const setUserIdentity = useSetAtom(userIdentityAtom);
  const setSearchFilters = useSetAtom(searchFiltersAtom);
  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, helpers) => {
      const identityPart = {
        lastName: values.lastName.trim(),
        firstName: values.firstName.trim(),
        middleName: values.middleName.trim() ?? "",
        dateOfBirth: formatDate(values.dateOfBirth!, "yyyy-MM-dd"),
      };

      const response = await activitiesApi.identify(identityPart);

      setUserIdentity({
        ...identityPart,
        type: "authenticated",
        id: response.userId,
        needOnboarding: response.needOnboarding,
        areas: response.areas,
      });

      if (response.needOnboarding) {
        router.push(paths.onboarding);
      } else {
        router.push(paths.activities);
      }
    },
  });

  const handleSkipClick = async () => {
    // Костыль для бэка
    const identityPart = {
      lastName: "Иванов",
      firstName: "Иван",
      middleName: "Иванович",
      dateOfBirth: "1970-01-01",
    };

    const response = await activitiesApi.identify(identityPart);

    setSearchFilters((searchFilters) => ({
      ...searchFilters,
      healthProblems: formik.values.healthProblems,
    }));

    setUserIdentity({
      ...identityPart,
      type: "anonymous",
      id: response.userId,
      needOnboarding: response.needOnboarding,
      areas: response.areas,
    });

    if (response.needOnboarding) {
      router.push(paths.onboarding);
    } else {
      router.push(paths.activities);
    }
  };

  const handleRandomizeClick = async () => {
    const randomIdentity = await activitiesApi.somebody();
    formik.setValues({
      ...randomIdentity,
      dateOfBirth: new Date(randomIdentity.dateOfBirth),
      healthProblems: false,
      submit: null,
    });
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
          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
              <TextField
                autoFocus
                error={!!(formik.touched.lastName && formik.errors.lastName)}
                fullWidth
                helperText={formik.touched.lastName && formik.errors.lastName}
                label="Фамилия"
                name="lastName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.lastName}
              />
              <TextField
                error={!!(formik.touched.firstName && formik.errors.firstName)}
                fullWidth
                helperText={formik.touched.firstName && formik.errors.firstName}
                label="Имя"
                name="firstName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.firstName}
              />
              <TextField
                error={
                  !!(formik.touched.middleName && formik.errors.middleName)
                }
                fullWidth
                helperText={
                  formik.touched.middleName && formik.errors.middleName
                }
                label="Отчество (при наличии)"
                name="middleName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.middleName}
              />
              <DatePicker
                label="Дата рождения"
                slots={{
                  openPickerIcon: Calendar,
                }}
                slotProps={{
                  textField: {
                    name: "dateOfBirth",
                    error: !!(
                      formik.touched.dateOfBirth && formik.errors.dateOfBirth
                    ),
                    helperText:
                      formik.touched.dateOfBirth &&
                      formik.errors.dateOfBirth &&
                      "Укажите вашу дату рождения",
                    onBlur: formik.handleBlur,
                  },
                }}
                value={formik.values.dateOfBirth}
                onChange={(value) => {
                  formik.setFieldValue("dateOfBirth", value);
                }}
                disableFuture
                disableHighlightToday
              />
              {/* <Stack position="relative">
                <WarningStripes
                  sx={{
                    position: "absolute",
                    borderRadius: 2,
                  }}
                />
                <TextField
                  error={!!(formik.touched.id && formik.errors.id)}
                  fullWidth
                  helperText={formik.touched.id && formik.errors.id}
                  label="Только в рамках хакатона: Идентификационный номер"
                  name="id"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.id}
                />
              </Stack> */}
              <FormGroup sx={{ pl: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox {...formik.getFieldProps("healthProblems")} />
                  }
                  label="Есть ограничения по здоровью"
                />
              </FormGroup>
            </Stack>
            {formik.errors.submit && (
              <FormHelperText error sx={{ mt: 3 }}>
                {formik.errors.submit as string}
              </FormHelperText>
            )}

            <Stack mt={2} spacing={1}>
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Продолжить
              </Button>
              <Stack position="relative">
                <WarningStripes
                  sx={{
                    position: "absolute",
                    borderRadius: 2,
                  }}
                />
                <Button
                  disabled={formik.isSubmitting}
                  fullWidth
                  size="large"
                  variant="outlined"
                  onClick={handleRandomizeClick}
                  sx={{
                    borderColor: "warning.main",
                  }}
                >
                  Заполнить случайными данными
                </Button>
              </Stack>
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                onClick={handleSkipClick}
              >
                Продолжить без ввода данных
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
