import React, { useMemo } from 'react';
import useSnapclient from 'src/controllers/snapcontrol/useSnapclient';
import StreamDisplay from './StreamDisplay';

const Stream = () => {
  const { streams } = useSnapclient()

  const streamElements = useMemo(() => {
    return Object.values(streams).map((stream) => {
      return <StreamDisplay stream={stream} key={stream.id} />
    })
  }, [streams])

  return streamElements
}

export default Stream