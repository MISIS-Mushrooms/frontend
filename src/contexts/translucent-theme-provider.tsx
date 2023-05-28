import { alpha, createTheme, ThemeProvider, useTheme } from "@mui/material";
import { FC, ReactNode, useMemo } from "react";

export const TranslucentThemeProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const theme = useTheme();

  const translucentTheme = useMemo(() => {
    return createTheme(theme, {
      palette: {
        background: {
          paper: alpha(theme.palette.background.paper, 0.85),
        },
        divider: alpha(theme.palette.divider, 0.85),
      },
    });
  }, [theme]);

  return <ThemeProvider theme={translucentTheme}>{children}</ThemeProvider>;
};
