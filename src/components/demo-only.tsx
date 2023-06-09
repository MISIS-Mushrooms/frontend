import { Stack } from "@mui/material";
import type { FC } from "react";
import { ReactNode } from "react";
import { WarningStripes } from "./warning-stripes";

export const DemoOnly: FC<{ children?: ReactNode }> = ({ children }) => (
  <Stack position="relative">
    <WarningStripes
      sx={{
        position: "absolute",
        borderRadius: 2,
      }}
    />
    {children}
  </Stack>
);
