import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dateFnsLocaleRu from "date-fns/locale/ru";
import type { AppProps } from "next/app";
import Head from "next/head";
import { RTL } from "src/components/rtl";
import { SplashScreen } from "src/components/splash-screen";
import { Toaster } from "src/components/toaster";
import { AuthConsumer, AuthProvider } from "src/contexts/auth/jwt-context";
import {
  SettingsConsumer,
  SettingsProvider,
} from "src/contexts/settings-context";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import "../styles/globals.css";
// Remove if simplebar is not used
import "simplebar-react/dist/simplebar.min.css";

const clientSideEmotionCache = createEmotionCache();

const App = (props: AppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Московское долголетие</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={dateFnsLocaleRu}
      >
        <AuthProvider>
          <AuthConsumer>
            {(auth) => (
              <SettingsProvider>
                <SettingsConsumer>
                  {(settings) => {
                    // Prevent theme flicker when restoring custom settings from browser storage
                    if (!settings.isInitialized) {
                      // return null;
                    }

                    const theme = createTheme({
                      colorPreset: settings.colorPreset,
                      contrast: settings.contrast,
                      direction: settings.direction,
                      paletteMode: settings.paletteMode,
                      responsiveFontSizes: settings.responsiveFontSizes,
                    });

                    // Prevent guards from redirecting
                    const showSlashScreen = !auth.isInitialized;

                    return (
                      <ThemeProvider theme={theme}>
                        <Head>
                          <meta
                            name="color-scheme"
                            content={settings.paletteMode}
                          />
                          <meta
                            name="theme-color"
                            content={theme.palette.neutral[900]}
                          />
                        </Head>
                        <RTL direction={settings.direction}>
                          <CssBaseline />
                          {showSlashScreen ? (
                            <SplashScreen />
                          ) : (
                            getLayout(<Component {...pageProps} />)
                          )}
                          <Toaster />
                        </RTL>
                      </ThemeProvider>
                    );
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            )}
          </AuthConsumer>
        </AuthProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
