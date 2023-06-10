import {
  Button,
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
import { useState } from "react";
import { activitiesApi } from "src/api/activities";
import { DemoOnly } from "src/components/demo-only";
import Calendar from "src/icons/untitled-ui/duocolor/calendar";
import { UserIdentity } from "src/types/user-identity";
import * as Yup from "yup";

interface Values {
  userId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: Date | null;
  healthProblems: boolean;
  submit: null;
}

const initialValues: Values = {
  userId: "",
  lastName: "",
  firstName: "",
  middleName: "",
  dateOfBirth: null,
  healthProblems: false,
  submit: null,
};

const validationSchema = Yup.object({
  userId: Yup.number().nullable(),
  firstName: Yup.string(),
  lastName: Yup.string(),
  middleName: Yup.string().nullable(),
  dateOfBirth: Yup.date().nullable(),
  healthProblems: Yup.boolean(),
});

type IdentityFormProps = {
  onIdentify: (identity: UserIdentity, healthProblems: boolean) => void;
  onSkip?: () => void;
  allowSkip?: boolean;
};

export const IdentityForm = ({ onIdentify, allowSkip }: IdentityFormProps) => {
  const [randomizing, setRandomizing] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, helpers) => {
      const identityPart = values.userId
        ? { userId: values.userId }
        : {
            lastName: values.lastName.trim(),
            firstName: values.firstName.trim(),
            middleName: values.middleName.trim() ?? "",
            dateOfBirth: formatDate(values.dateOfBirth!, "yyyy-MM-dd"),
          };

      const { userId, ...identityPart2 } = await activitiesApi.identify(
        identityPart,
      );

      const id = values.userId || userId;

      const identity = {
        ...identityPart2,
        type: "authenticated" as const,
        id,
      };

      onIdentify(identity, formik.values.healthProblems);
    },
  });

  const disabled = randomizing || formik.isSubmitting;

  const handleSkipClick = async () => {
    // Костыль для бэка
    const identityPart = {
      lastName: "Иванов",
      firstName: "Иван",
      middleName: "Иванович",
      dateOfBirth: "1970-01-01",
    };

    const { userId: id, ...identityPart2 } = await activitiesApi.identify(
      identityPart,
    );

    const identity = {
      ...identityPart2,
      type: "anonymous" as const,
      id,
    };

    onIdentify(identity, formik.values.healthProblems);
  };

  const handleRandomizeClick = async () => {
    setRandomizing(true);
    const identity = await activitiesApi.somebody();
    formik.setValues({
      ...identity,
      userId: "",
      dateOfBirth: new Date(identity.dateOfBirth),
      healthProblems: false,
      submit: null,
    });
    setRandomizing(false);
  };

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        <TextField
          autoFocus
          error={!!(formik.touched.lastName && formik.errors.lastName)}
          fullWidth
          helperText={formik.touched.lastName && formik.errors.lastName}
          label="Фамилия"
          type="text"
          {...formik.getFieldProps("lastName")}
          disabled={disabled}
        />
        <TextField
          error={!!(formik.touched.firstName && formik.errors.firstName)}
          fullWidth
          helperText={formik.touched.firstName && formik.errors.firstName}
          label="Имя"
          type="text"
          {...formik.getFieldProps("firstName")}
          disabled={disabled}
        />
        <TextField
          error={!!(formik.touched.middleName && formik.errors.middleName)}
          fullWidth
          helperText={formik.touched.middleName && formik.errors.middleName}
          label="Отчество (при наличии)"
          type="text"
          {...formik.getFieldProps("middleName")}
          disabled={disabled}
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
          disabled={disabled}
        />
        <DemoOnly>
          <TextField
            error={!!(formik.touched.userId && formik.errors.userId)}
            fullWidth
            helperText={formik.touched.userId && formik.errors.userId}
            label="Идентификационный номер"
            type="text"
            {...formik.getFieldProps("userId")}
            disabled={disabled}
          />
        </DemoOnly>
        <FormGroup sx={{ pl: 1 }}>
          <FormControlLabel
            control={<Checkbox {...formik.getFieldProps("healthProblems")} />}
            label="Есть ограничения по здоровью"
            disabled={disabled}
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
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={disabled}
        >
          Продолжить
        </Button>
        <DemoOnly>
          <Button
            fullWidth
            size="large"
            variant="outlined"
            onClick={handleRandomizeClick}
            sx={{
              borderColor: "warning.main",
            }}
            disabled={disabled}
          >
            Заполнить случайными данными
          </Button>
        </DemoOnly>
        {allowSkip && (
          <Button fullWidth onClick={handleSkipClick} disabled={disabled}>
            Продолжить без ввода данных
          </Button>
        )}
      </Stack>
    </form>
  );
};
