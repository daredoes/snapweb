import { useLayoutEffect, useMemo } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import useSnapclient from "src/controllers/snapcontrol/useSnapclient/useSnapclient";
import Streams from "./Stream/Streams";
import { useAtom } from "jotai";
import { serverUrlAtom } from "src/atoms/snapclient/localStorage";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/jsonrpc"

export interface SnapclientController { }

const SnapclientController = ({ }: SnapclientController) => {
  const [url, _setStreamUrl] = useAtom(serverUrlAtom)
  const debouncedUrl = useDebounce(url, 1000);
  const { connect } = useSnapclient()

  const httpUrl = useMemo(() => {
    return debouncedUrl || DEFAULT_SNAPCAST_URL
  }, [debouncedUrl])

  useLayoutEffect(() => {
    connect(httpUrl)
  }, [httpUrl])
  return (<Streams />)
};

export default SnapclientController;
