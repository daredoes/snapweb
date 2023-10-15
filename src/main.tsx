import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material";

import App from "./app";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider
      theme={createTheme({
        components: {
          MuiCssBaseline: {
            styleOverrides: (themeParam) => `
            body {
              background-color: ${themeParam.palette.grey[400]};
            }
          `,
          },
        },
      })}
    >
      <CssBaseline enableColorScheme={true} />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
