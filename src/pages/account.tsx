import {
  Button,
  ButtonGroup,
  Card,
  Container,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import ThumbsDownIcon from "@untitled-ui/icons-react/build/esm/ThumbsDown";
import ThumbsUpIcon from "@untitled-ui/icons-react/build/esm/ThumbsUp";
import UserX01Icon from "@untitled-ui/icons-react/build/esm/UserX01";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { withImmer } from "jotai-immer";
import NextLink from "next/link";
import {
  addFriendDialogOpenAtom,
  friendIdentitiesAtom,
  likesAtom,
  userIdentityAtom,
} from "src/atoms";
import { Seo } from "src/components/seo";
import { MainLayout } from "src/layouts/main";
import { paths } from "src/paths";
import type { Page as PageType } from "src/types/page";
import { assert } from "src/utils/assert";
import { formatPersonName } from "src/utils/formatting";

const Page: PageType = () => {
  const userIdentity = useAtomValue(userIdentityAtom);
  const [likes, setLikes] = useAtom(withImmer(likesAtom));
  const [friendIdentities, setFriendIdentities] = useAtom(
    withImmer(friendIdentitiesAtom),
  );
  const setAddFriendDialogOpen = useSetAtom(addFriendDialogOpenAtom);

  assert(userIdentity);
  const { lastName, firstName, middleName } = userIdentity;

  const addFriendButton = (
    <Button
      onClick={() => setAddFriendDialogOpen(true)}
      variant="outlined"
      size="small"
    >
      Добавить ещё
    </Button>
  );

  const handleRemoveFriend = (id: string) => {
    setFriendIdentities((draft) => {
      delete draft[id];
    });
  };

  const handleLike = (id: string) => {
    setLikes((draft) => {
      if (draft[id] === "liked") {
        delete draft[id];
      } else {
        draft[id] = "liked";
      }
    });
  };
  const handleDislike = (id: string) => {
    setLikes((draft) => {
      if (draft[id] === "disliked") {
        delete draft[id];
      } else {
        draft[id] = "disliked";
      }
    });
  };

  return (
    <>
      <Seo title="Личный кабинет" />
      <Container maxWidth="lg">
        {userIdentity.type === "anonymous" ? (
          <Typography variant="h6">
            Чтобы посмотреть историю своих посещений и воспользоваться другими
            функциями личного кабинета,{" "}
            <Link component={NextLink} href={paths.login}>
              заполните свои данные
            </Link>
          </Typography>
        ) : (
          <Stack gap={1}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography variant="h5">
                Вы зашли как {formatPersonName(lastName, firstName, middleName)}
              </Typography>
              <Button
                component={NextLink}
                href={paths.login}
                variant="outlined"
                size="small"
              >
                Сменить пользователя
              </Button>
            </Stack>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography variant="h6" my={3}>
                Добавленные знакомые
              </Typography>
              {Object.keys(friendIdentities).length > 0 && (
                <Button
                  onClick={() => setAddFriendDialogOpen(true)}
                  variant="outlined"
                  size="small"
                >
                  Добавить ещё
                </Button>
              )}
            </Stack>
            {Object.keys(friendIdentities).length === 0 ? (
              <Stack alignItems="start">
                <Typography>Вы ещё никого не добавили.</Typography>
                <Button
                  onClick={() => setAddFriendDialogOpen(true)}
                  variant="outlined"
                  size="small"
                >
                  Добавить
                </Button>
              </Stack>
            ) : (
              <Card>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ФИО</TableCell>
                      <TableCell align="right">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(friendIdentities).map((entry) => (
                      <TableRow
                        key={entry.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontWeight: 600 }}
                        >
                          {formatPersonName(
                            entry.lastName,
                            entry.firstName,
                            entry.middleName,
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            startIcon={
                              <SvgIcon>
                                <UserX01Icon />
                              </SvgIcon>
                            }
                            onClick={() => handleRemoveFriend(entry.id)}
                          >
                            Удалить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
            <Typography variant="h6" my={3}>
              История посещений
            </Typography>
            {userIdentity.history.length === 0 ? (
              <Typography>Вы ещё не посещали наши занятия.</Typography>
            ) : (
              <Card>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Дата</TableCell>
                      <TableCell>Категория</TableCell>
                      <TableCell>Занятие</TableCell>
                      <TableCell align="right">Оценка</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userIdentity.history.map((entry) => (
                      <TableRow
                        key={entry.id + entry.variant.visitedAt}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontWeight: 600 }}
                        >
                          {new Date(entry.variant.visitedAt).toLocaleDateString(
                            "ru",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </TableCell>
                        <TableCell>{entry.category2}</TableCell>
                        <TableCell>{entry.category3}</TableCell>
                        <TableCell align="right">
                          <ButtonGroup>
                            <IconButton
                              color={
                                likes[entry.id + entry.variant.visitedAt] ===
                                "liked"
                                  ? "primary"
                                  : undefined
                              }
                              onClick={() =>
                                handleLike(entry.id + entry.variant.visitedAt)
                              }
                            >
                              <SvgIcon>
                                <ThumbsUpIcon />
                              </SvgIcon>
                            </IconButton>
                            <IconButton
                              color={
                                likes[entry.id + entry.variant.visitedAt] ===
                                "disliked"
                                  ? "error"
                                  : undefined
                              }
                              onClick={() =>
                                handleDislike(
                                  entry.id + entry.variant.visitedAt,
                                )
                              }
                            >
                              <SvgIcon>
                                <ThumbsDownIcon />
                              </SvgIcon>
                            </IconButton>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </Stack>
        )}
      </Container>
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
