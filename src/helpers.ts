export function convertHttpToWebsocket(httpUrl: string): string {
  try {
    const url = new URL(httpUrl);
    return (url.protocol === "https:" ? "wss://" : "ws://") + url.host + url.pathname;
  } catch {
    return httpUrl
  }
}

export function getDefaultBaseUrl(): string {
  return convertHttpToWebsocket(window.location.href);
}
