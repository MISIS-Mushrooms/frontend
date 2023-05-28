import type { PaletteColor } from "@mui/material/styles/createPalette";
import { blue } from "./colors";
import type { ColorPreset } from "./index";

export const getPrimary = (preset?: ColorPreset): PaletteColor => {
  switch (preset) {
    case "blue":
      return blue;
    default:
      console.error('Invalid color preset, accepted values: "blue".');
      return blue;
  }
};
