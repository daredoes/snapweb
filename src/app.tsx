import React from 'react';
import { Box } from "@mui/material";
import { useRenderInfo } from "@uidotdev/usehooks";
import SnapclientController from "src/components/SnapclientController";
import SnapcastAppBar from './components/SnapcastAppBar';

function App() {
  const pageRenderInfo = useRenderInfo('Main App')

  return (
    <Box height={'100%'} display={'flex'} flexWrap={'wrap'} flexDirection={'row'} alignItems={'flex-start'} justifyContent={'center'} component={'main'}>
      <SnapcastAppBar title={`${pageRenderInfo?.name}: ${pageRenderInfo?.renders}`} />
      <Box p={1} gap={1} overflow={'scroll'} display={'flex'} flexDirection={'row'} flexWrap={'wrap'} alignContent={'center'} justifyContent={'center'}>
        <SnapclientController />
      </Box>
    </Box>
  );
}

export default App;
