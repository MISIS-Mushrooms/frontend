import type { PaletteColor } from "@mui/material";
import type { NeutralColors } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

const withAlphas = (color: PaletteColor): PaletteColor => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.3),
    alpha50: alpha(color.main, 0.5),
  };
};

export const neutral: NeutralColors = {
  50: "#F3F5F7",
  100: "#EEEFF2",
  200: "#DFE1E6",
  300: "#C4C8D0",
  400: "#B2B5BB",
  500: "#8E9196",
  600: "#696C71",
  700: "#4C525C",
  800: "#3C3E41",
  900: "#0E0E0F",
};

export const blue = withAlphas({
  lightest: "#EBF1FF",
  light: "#DDE7FF",
  main: "#0044CC",
  dark: "#0033AA",
  darkest: "#002277",
  contrastText: "#FFFFFF",
});

export const success = withAlphas({
  lightest: "#E6FAF0",
  light: "#AFF8C7",
  main: "#008844",
  dark: "#006633",
  darkest: "#003311",
  contrastText: "#FFFFFF",
});

export const info = withAlphas({
  lightest: "#ECFDFF",
  light: "#CFF9FE",
  main: "#06AED4",
  dark: "#0E7090",
  darkest: "#164C63",
  contrastText: "#FFFFFF",
});

export const warning = withAlphas({
  lightest: "#FFF7E6",
  light: "#FFF1CC",
  main: "#FFAA00",
  dark: "#EE8800",
  darkest: "#CC6600",
  contrastText: "#FFFFFF",
});

export const error = withAlphas({
  lightest: "#FFF2F2",
  light: "#FFDEDD",
  main: "#AA0000",
  dark: "#880000",
  darkest: "#660000",
  contrastText: "#FFFFFF",
});
