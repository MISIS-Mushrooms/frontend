import { Box, styled } from "@mui/material";

export const WarningStripes = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 47,
  backgroundColor: theme.palette.warning.main,
  maskImage: "url('/assets/warning-stripes.svg')",
  opacity: 0.25,
}));
