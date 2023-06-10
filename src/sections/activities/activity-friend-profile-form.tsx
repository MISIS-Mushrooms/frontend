import { Button, Checkbox, Unstable_Grid2 as Grid } from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { withImmer } from "jotai-immer";
import {
  addFriendDialogOpenAtom,
  friendIdentitiesAtom,
  searchFiltersAtom,
} from "src/atoms";
import { ButtonLikeFormControlLabel } from "src/components/button-like-form-control-label";
import { formatPersonName } from "src/utils/formatting";
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
  const setAddFriendDialogOpen = useSetAtom(addFriendDialogOpenAtom);
  const friendIdentities = useAtomValue(friendIdentitiesAtom);
  const [searchFilters, setSearchFilters] = useAtom(
    withImmer(searchFiltersAtom),
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const friendId = event.target.name;
    setSearchFilters((filters) => {
      filters.friendIds = event.target.checked
        ? [...filters.friendIds, friendId]
        : filters.friendIds.filter((id) => id !== friendId);
    });
  };

  const handleGrandsonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters((filters) => {
      filters.withGrandson = event.target.checked;
    });
  };

  return (
    <Grid
      container
      p={1}
      maxHeight={200}
      overflow="auto"
      justifyContent="center"
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
          label="С внуком или внучкой"
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
            label={
              "С " +
              formatPersonName(
                friend.lastName,
                friend.firstName,
                friend.middleName,
                "instrumental",
              )
            }
          />
        </Grid>
      ))}
      <Button onClick={() => setAddFriendDialogOpen(true)}>
        Добавить друга
      </Button>
    </Grid>
  );
};
