import { AppBar, Box, IconButton, Paper, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRenderInfo } from "@uidotdev/usehooks";
import AudioController from "src/components/AudioController";
import SnapclientController from "src/components/SnapclientController";
import SnapclientSettingsIcon from "./components/SnapclientSettingsIcon";
import useSnapclient from "./controllers/snapcontrol/useSnapclient";
import { useMemo } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ToggleShowOfflineClients from "./components/ToggleShowOfflineClients";

function App() {
  const pageRenderInfo = useRenderInfo('Main App')
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
    <Box height={'100%'} display={'flex'} flexWrap={'wrap'} flexDirection={'row'} alignItems={'flex-start'} justifyContent={'center'} component={'main'}>
      
      <AppBar sx={{alignSelf: 'flex-start'}} position="sticky">
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
           <ToggleShowOfflineClients sx={{marginLeft: 'auto'}} />
        </Toolbar>
      </AppBar>
      <Box p={1} gap={1} overflow={'scroll'} display={'flex'} flexDirection={'row'} flexWrap={'wrap'} alignContent={'center'} justifyContent={'center'}>
        {/* <AudioController /> */}
        <SnapclientController />
      </Box>
    </Box>
  );
}

export default App;
