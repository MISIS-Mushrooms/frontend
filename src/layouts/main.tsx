import { Box, Button, Container, Stack, styled, SvgIcon } from "@mui/material";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import User01Icon from "@untitled-ui/icons-react/build/esm/User01";
import NextLink from "next/link";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { Logo } from "src/components/logo";
import { withAuthGuard } from "src/hocs/with-auth-guard";
import { paths } from "src/paths";

const TOP_NAV_HEIGHT = 64;

const LayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: "100%",
}));

interface LayoutProps {
  children?: ReactNode;
}

export const MainLayout: FC<LayoutProps> = withAuthGuard((props) => {
  const { children } = props;
  const router = useRouter();

  return (
    <LayoutRoot>
      <Box component="header">
        <Container maxWidth="lg">
          <Stack
            height={TOP_NAV_HEIGHT}
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <Logo />
            <Box flexGrow={1} />
            {router.pathname !== paths.account ? (
              <Button
                color="primary"
                component={NextLink}
                href={paths.account}
                startIcon={
                  <SvgIcon>
                    <User01Icon />
                  </SvgIcon>
                }
              >
                Личный кабинет
              </Button>
            ) : (
              <Button
                component={NextLink}
                href={paths.index}
                startIcon={
                  <SvgIcon>
                    <ArrowLeftIcon />
                  </SvgIcon>
                }
                sx={{ my: 2 }}
                variant="contained"
              >
                Вернуться к занятиям
              </Button>
            )}
          </Stack>
        </Container>
      </Box>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          flex: "1 1 auto",
          pb: TOP_NAV_HEIGHT + "px",
        }}
      >
        {children}
      </Box>
    </LayoutRoot>
  );
});
