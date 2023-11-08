import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import PlayIcon from "./Icons/PlayIcon";
import StopIcon from "./Icons/StopIcon";
import SnapclientBrowser from "src/controllers/snapcontrol/SnapclientBrowser";
import { convertHttpToWebsocket } from "src/helpers";
import { useLongPress } from "@uidotdev/usehooks";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  InputAdornment,
  TextField,
  useTheme,
} from "@mui/material";
import { Link } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMediaMeta, useMediaSession } from "use-media-session";
import { useAtom } from "jotai";
import { streamUrlAtom } from "src/atoms/snapclient/localStorage";
import { IMediaElementAudioSourceNode } from "standardized-audio-context";
import AC from "src/types/snapcast/AudioContext/AudioContext";
import { clientIdAtom } from "src/atoms/snapclient";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/stream";

export interface AudioControllerProps {}

const AudioController = ({}: AudioControllerProps) => {
  const theme = useTheme();
  const [myId] = useAtom(clientIdAtom);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [internalUrl, setInternalUrl] = useState("");
  const [streamUrl, setStreamUrl] = useAtom(streamUrlAtom);
  const [snapclient, setSnapclient] = useState(new SnapclientBrowser());
  const [audioSource, setAudioSource] =
    useState<IMediaElementAudioSourceNode<AC> | null>(null);

  useMediaMeta({
    title: "Snapcast Stream",
  });

  useLayoutEffect(() => {
    if (!audioSource) {
      try {
        const source = snapclient.ctx.createMediaElementSource(
          document.querySelector("audio") || document.createElement("audio"),
        );
        setAudioSource(source);
        source.connect(snapclient.gainNode);
      } catch {}
    }
  }, [snapclient, audioSource, setAudioSource]);

  useEffect(() => {
    snapclient.baseUrl = convertHttpToWebsocket(
      streamUrl || DEFAULT_SNAPCAST_URL,
    );
  }, [streamUrl, snapclient]);

  const [disabled, setDisabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [settings, setSettings] = useState(false);

  const attrs = useLongPress(
    () => {
      setSettings(true);
    },
    {
      // onStart: (event) => console.log("Press started"),
      // onFinish: (event) => console.log("Press Finished"),
      // onCancel: (event) => console.log("Press cancelled"),
      threshold: 500,
    },
  );

  useEffect(() => {
    setInternalUrl(streamUrl);
  }, [setInternalUrl, streamUrl]);

  const closeSettings = useCallback(() => {
    setSettings(false);
  }, [setSettings]);

  const saveSettings = useCallback(() => {
    try {
      new URL(internalUrl);
      setStreamUrl(internalUrl);
    } catch {
      return false;
    }
    return true;
  }, [internalUrl, setStreamUrl]);

  const handleClickSave = useCallback(() => {
    if (saveSettings()) {
      setSettings(false);
      snapclient.stop();
      setSnapclient(new SnapclientBrowser(streamUrl));
    }
  }, [saveSettings, setSettings, snapclient, setSnapclient, streamUrl]);

  useEffect(() => {
    if (!snapclient.streamsocket) {
      snapclient.onConnect = () => {
        setDisabled(false);
      };
      snapclient.onError = () => {
        setDisabled(true);
      };
      snapclient.onDisconnect = () => {
        setPlaying(false);
      };
      snapclient.onPlay = (p) => {
        setPlaying(p);
      };
    }
  }, [setDisabled, setPlaying, snapclient]);

  const handleClick = useCallback(() => {
    console.log("click", playing, snapclient.streamsocket);
    if (playing) {
      snapclient.stop();
    } else {
      if (!snapclient.streamsocket) {
        snapclient.connect(
          "Snapweb Client",
          "00:00:00:00:00:00",
          "web",
          navigator.platform,
          myId,
        );
      }
      // snapclient.play();
    }
  }, [playing, snapclient]);

  useMediaSession({
    playbackState: disabled ? "none" : playing ? "playing" : "paused",
    onPause: () => {
      snapclient.stop();
    },
    onPlay: () => {
      if (!snapclient.streamsocket) {
        snapclient.connect();
      }
      snapclient.play();
    },
    onStop: () => {
      snapclient.stop();
    },
  });
  const icon = useMemo(() => {
    if (playing) {
      return (
        <StopIcon
          color="inherit"
          {...attrs}
          disabled={disabled}
          onClick={handleClick}
        />
      );
    }
    return (
      <PlayIcon
        color="inherit"
        {...attrs}
        disabled={disabled}
        onClick={handleClick}
      />
    );
  }, [playing, handleClick, disabled, attrs]);
  return (
    <Box>
      {icon}
      <Dialog
        fullScreen={fullScreen}
        onClose={closeSettings}
        open={settings}
        fullWidth={true}
      >
        <DialogTitle>Stream Client Settings</DialogTitle>
        <Box sx={{ padding: 2, height: "100%" }}>
          <TextField
            label="Server URL"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Link />
                </InputAdornment>
              ),
            }}
            value={internalUrl}
            onChange={(e) => {
              const newValue = e.currentTarget.value;
              setInternalUrl(newValue);
            }}
            placeholder={DEFAULT_SNAPCAST_URL}
            fullWidth={true}
          />
        </Box>
        <DialogActions>
          <Button onClick={closeSettings}>Close</Button>
          <Button onClick={handleClickSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AudioController;
