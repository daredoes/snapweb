export function convertHttpToWebsocket(httpUrl: string): string {
  const url = new URL(httpUrl)
  return (
    (url.protocol === "https:" ? "wss://" : "ws://") +
    url.hostname
  );
}

export function getDefaultBaseUrl(): string {
  return convertHttpToWebsocket(window.location.href)
}

