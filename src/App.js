import React from "react";
import { useRoutes } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { create } from "jss";
import { ThemeProvider } from "styled-components/macro";

import { StyledEngineProvider } from "@mui/styled-engine-sc";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
import StylesProvider from "@mui/styles/StylesProvider";
import jssPreset from "@mui/styles/jssPreset";

import "./i18n";
import createTheme from "./theme";
import routes from "./routes";

import useTheme from "./hooks/useTheme";

import { AuthProvider } from "./contexts/CognitoContext";
import { AppProvider } from "./contexts/AppContext";

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

function App() {
  const content = useRoutes(routes);

  const { theme } = useTheme();

  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | Sentinel UI" defaultTitle="Sentinel UI" />
      <AppProvider>
        <StylesProvider jss={jss}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StyledEngineProvider injectFirst>
              <MuiThemeProvider theme={createTheme(theme)}>
                <ThemeProvider theme={createTheme(theme)}>
                  <AuthProvider>{content}</AuthProvider>
                </ThemeProvider>
              </MuiThemeProvider>
            </StyledEngineProvider>
          </LocalizationProvider>
        </StylesProvider>
      </AppProvider>
    </HelmetProvider>
  );
}

export default App;
