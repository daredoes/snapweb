import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const AppWrapper: React.FC<any> = ({ children }) => {

  return (
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
      {children}
      {/* This might look strange, but react-toastify doesn't need to be an */}
      {/* ancestor of the <App /> children, since once it's in the DOM the */}
      {/* components/plugins (even the ones above it in the hierarchy) will */}
      {/* be able to call `toast()` without issues*/}
      <ToastContainer newestOnTop position='bottom-right' theme={'light'} />
    </ThemeProvider>
  )
}

export default AppWrapper
