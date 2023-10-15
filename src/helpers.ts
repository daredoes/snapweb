export function convertHttpToWebsocket(httpUrl: string): string {
  try {
    const url = new URL(httpUrl);
    return (
      (url.protocol === "https:" ? "wss://" : "ws://") + url.host + url.pathname
    );
  } catch {
    return httpUrl;
  }
}

export function getDefaultBaseUrl(): string {
  return convertHttpToWebsocket(window.location.href);
}

export function convertSecondsToTimestamp(floatSeconds?: number): string {
  let audioValue = "-:--";
  if (floatSeconds !== undefined) {
    const minutes = Math.floor(floatSeconds / 60);
    const remainingSeconds = floatSeconds - minutes * 60;
    audioValue = `${minutes.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      maximumFractionDigits: 0,
      useGrouping: false,
    })}:${remainingSeconds.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      maximumFractionDigits: 0,
      useGrouping: false,
    })}`;
  }
  return audioValue;
}
