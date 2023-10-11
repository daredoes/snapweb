import { AppBar, Box, Paper, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRenderInfo } from "@uidotdev/usehooks";
import AudioController from "src/components/AudioController";
import SnapclientController from "src/components/SnapclientController";
import SnapclientSettingsIcon from "./components/SnapclientSettingsIcon";
import useSnapclient from "./controllers/snapcontrol/useSnapclient";
import { useMemo } from "react";

function App() {
  const pageRenderInfo = useRenderInfo('Main App')
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { serverDetails } = useSnapclient()

  const title = useMemo(() => {
    if (serverDetails) {
      if (serverDetails.host.name) {
        return `Snapcast: ${serverDetails.host.name}`
      }
    }
    return "Snapcast: Browser Edition"
  }, [serverDetails])

  return (
    <Box component={'main'}>
      
      <AppBar position="sticky">
        <Toolbar>
          <SnapclientSettingsIcon
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
           />
           <Typography title={`${pageRenderInfo?.name}: ${pageRenderInfo?.renders}`}>
            {title}
           
           </Typography>
        </Toolbar>
      </AppBar>
      <Paper sx={{m: fullScreen ? '0.25rem' : '0.5rem'}}>
        {/* <AudioController /> */}
        <SnapclientController />
      </Paper>
    </Box>
  );
}

export default App;
