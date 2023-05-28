import {
  Button,
  CardContent,
  CardHeader,
  Checkbox,
  FormHelperText,
  Stack,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { format as formatDate } from "date-fns";
import { useFormik } from "formik";
import { useAtom } from "jotai";
import { activitiesApi } from "src/api/activities";
import { friendIdentitiesAtom, searchFiltersAtom } from "src/atoms";
import { ButtonLikeFormControlLabel } from "src/components/button-like-form-control-label";
import { WarningStripes } from "src/components/warning-stripes";
import Calendar from "src/icons/untitled-ui/duocolor/calendar";
import { formatName } from "src/utils/format-name";
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

const exampleValues: Values[] = [
  {
    lastName: "Виноградова",
    firstName: "Ия",
    middleName: "Святославовна",
    dateOfBirth: new Date("1959-09-10"),
    healthProblems: false,
    submit: null,
  },
  {
    lastName: "Медведев",
    firstName: "Аверкий",
    middleName: "Глебович",
    dateOfBirth: new Date("1949-05-19"),
    healthProblems: false,
    submit: null,
  },
  {
    lastName: "Сысоева",
    firstName: "Екатерина",
    middleName: "Максимовна",
    dateOfBirth: new Date("1963-06-17"),
    healthProblems: false,
    submit: null,
  },
  {
    lastName: "Беспалова",
    firstName: "Жанна",
    middleName: "Петровна",
    dateOfBirth: new Date("1958-02-18"),
    healthProblems: false,
    submit: null,
  },
  {
    lastName: "Колобов",
    firstName: "Вячеслав",
    middleName: "Даниилович",
    dateOfBirth: new Date("1954-12-06"),
    healthProblems: false,
    submit: null,
  },
];

const validationSchema = Yup.object({
  firstName: Yup.string().required("Введите имя"),
  lastName: Yup.string().required("Введите фамилию"),
  middleName: Yup.string().nullable(),
  dateOfBirth: Yup.date().required("Укажите вашу дату рождения"),
  healthProblems: Yup.boolean(),
});

export const ActivityFriendProfileForm = () => {
  const [friendIdentities, setFriendIdentities] = useAtom(friendIdentitiesAtom);
  const [searchFilters, setSearchFilters] = useAtom(searchFiltersAtom);

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

      setFriendIdentities((friendIdentities) => ({
        ...friendIdentities,
        [response.userId]: {
          ...identityPart,
          type: "authenticated",
          id: response.userId,
          needOnboarding: response.needOnboarding,
          areas: response.areas,
        },
      }));

      setSearchFilters((prev) => ({
        ...prev,
        friendIds: [...prev.friendIds, response.userId],
      }));

      formik.setValues(initialValues);
    },
  });

  const handleRandomizeClick = async () => {
    const randomIdentity = await activitiesApi.somebody();
    formik.setValues({
      ...randomIdentity,
      dateOfBirth: new Date(randomIdentity.dateOfBirth),
      healthProblems: false,
      submit: null,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const friendId = event.target.name;
    setSearchFilters((prev) => ({
      ...prev,
      friendIds: event.target.checked
        ? [...prev.friendIds, friendId]
        : prev.friendIds.filter((id) => id !== friendId),
    }));
  };

  const handleGrandsonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters((prev) => ({
      ...prev,
      withGrandson: event.target.checked,
    }));
  };

  return (
    <>
      <Grid
        container
        component={CardContent}
        justifyContent={{ xs: "center", sm: "start" }}
        spacing={{ xs: 0 }}
        sx={{ pb: 0 }}
      >
        <Grid>
          <ButtonLikeFormControlLabel
            control={
              <Checkbox
                color="secondary"
                checked={searchFilters.withGrandson}
                onChange={handleGrandsonChange}
              />
            }
            label="С внуком"
          />
        </Grid>
        {Object.values(friendIdentities).map((friend) => (
          <Grid key={friend.id}>
            <ButtonLikeFormControlLabel
              control={
                <Checkbox
                  name={friend.id}
                  checked={searchFilters.friendIds.includes(friend.id)}
                  onChange={handleChange}
                />
              }
              label={formatName(
                friend.lastName,
                friend.firstName,
                friend.middleName ?? undefined,
              )}
            />
          </Grid>
        ))}
      </Grid>
      <CardHeader
        sx={{ pb: 0 }}
        title="Введите данные человевка, который может составить вам компанию, чтобы мы подобрали занятия, которые понравятся вам обоим"
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
              error={!!(formik.touched.middleName && formik.errors.middleName)}
              fullWidth
              helperText={formik.touched.middleName && formik.errors.middleName}
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
                    "Укажите дату рождения",
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
              Добавить
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
          </Stack>
        </form>
      </CardContent>
    </>
  );
};
