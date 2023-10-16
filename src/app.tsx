import { Box } from "@mui/material";
import { useRenderInfo } from "@uidotdev/usehooks";
import SnapclientController from "src/components/SnapclientController";
import SnapcastAppBar from "./components/SnapcastAppBar";
import SnapclientSettings from "./components/SnapclientSettings";
import SwitchStreams from "./components/Dialogs/SwitchStream";
import ClientSettings from "./components/Dialogs/ClientSettings";
import GroupClientsSettings from "./components/Dialogs/GroupClientsSettings";
import { ANCHOR_TO_MODAL, ModalHashes, useGlobalModal } from "./atoms/global-modal";
import React from "react";

function App() {
  const pageRenderInfo = useRenderInfo("Main App");
  useGlobalModal()
  return (
    <>
      <Box
        height={"100%"}
        display={"flex"}
        flexWrap={"wrap"}
        flexDirection={"row"}
        alignItems={"flex-start"}
        justifyContent={"center"}
        component={"main"}
      >
        <SnapcastAppBar
          title={`${pageRenderInfo?.name}: ${pageRenderInfo?.renders}`}
        />
        <Box
          p={1}
          gap={1}
          overflow={"scroll"}
          display={"flex"}
          flexDirection={"row"}
          flexWrap={"wrap"}
          alignContent={"center"}
          justifyContent={"center"}
        >
          <SnapclientController />
        </Box>
      </Box>
      {/* Dialogs Go Here */}
      <SnapclientSettings />
      <SwitchStreams />
      <ClientSettings />
      <GroupClientsSettings />
    </>
  );
}

export default App;
