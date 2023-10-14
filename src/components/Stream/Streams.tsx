import { useMemo } from 'react';
import useSnapclient from 'src/controllers/snapcontrol/useSnapclient';
import StreamDisplay from './StreamDisplay';

const Stream = () => {
  const { streams } = useSnapclient()

  const streamElements = useMemo(() => {
    return Object.keys(streams).map((streamId) => {
      return <StreamDisplay id={streamId} key={streamId} />
    })
  }, [streams])

  return streamElements
}

export default Stream