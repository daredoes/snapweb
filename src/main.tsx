import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material";

import App from "./app.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";
import SnapclientSettings from "./components/SnapclientSettings.tsx";
import SwitchStreams from "./components/Dialogs/SwitchStream.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={createTheme({
      components: {
        MuiCssBaseline: {
          styleOverrides: (themeParam) => `
            body {
              background-color: ${themeParam.palette.grey[400]};
            }
          `,
        },
      }
    })}>
      <CssBaseline enableColorScheme={true} />
      <App />
      {/* Dialogs Go Here */}
      <SnapclientSettings />
      <SwitchStreams />
    </ThemeProvider>
  </React.StrictMode>
);
