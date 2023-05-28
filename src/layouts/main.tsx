import { Box, Container, Stack, styled } from "@mui/material";
import type { FC, ReactNode } from "react";
import { Logo } from "src/components/logo";
import { withAuthGuard } from "src/hocs/with-auth-guard";

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

  return (
    <LayoutRoot>
      <Box component="header">
        <Container maxWidth="lg">
          <Stack direction="row" spacing={2} sx={{ height: TOP_NAV_HEIGHT }}>
            <Logo />
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
