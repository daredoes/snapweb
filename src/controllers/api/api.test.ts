import { expect, test } from "bun:test";
import { makeRequest, API } from "./index";
import { ServerRequest } from "src/types/snapcast";

const jsonrpc = "2.0";

test("test Make Request makes test request", () => {
  const result = makeRequest("test");
  const expected: ServerRequest = {
    id: "test",
    method: "test",
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API serverGetStatus makes request", () => {
  const result = API.serverGetStatus();
  const expected: ServerRequest = {
    id: "Server.GetStatus",
    method: "Server.GetStatus",
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API streamControlSetPosition makes request", () => {
  const deviceId = "device";
  const command = "setPosition";
  const result = API.streamControlSetPosition({
    id: deviceId,
    params: {
      position: 0,
    },
  });
  const expected: ServerRequest = {
    id: `Stream.Control.${command}`,
    method: "Stream.Control",
    params: {
      id: deviceId,
      command: command,
      params: {
        position: 0,
      },
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API streamControlSeek makes request", () => {
  const deviceId = "device";
  const command = "seek";
  const result = API.streamControlSeek({
    id: deviceId,
    params: {
      offset: 0,
    },
  });
  const expected: ServerRequest = {
    id: `Stream.Control.${command}`,
    method: "Stream.Control",
    params: {
      id: deviceId,
      command: command,
      params: {
        offset: 0,
      },
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API streamControlPrevious makes request", () => {
  const deviceId = "device";
  const command = "previous";
  const result = API.streamControlPrevious({
    id: deviceId,
  });
  const expected: ServerRequest = {
    id: `Stream.Control.${command}`,
    method: "Stream.Control",
    params: {
      id: deviceId,
      command: command,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API streamControlNext makes request", () => {
  const deviceId = "device";
  const command = "next";
  const result = API.streamControlNext({
    id: deviceId,
  });
  const expected: ServerRequest = {
    id: `Stream.Control.${command}`,
    method: "Stream.Control",
    params: {
      id: deviceId,
      command: command,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API streamControlStop makes request", () => {
  const deviceId = "device";
  const command = "stop";
  const result = API.streamControlStop({
    id: deviceId,
  });
  const expected: ServerRequest = {
    id: `Stream.Control.${command}`,
    method: "Stream.Control",
    params: {
      id: deviceId,
      command: command,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API streamControlPlayPause makes request", () => {
  const deviceId = "device";
  const command = "playPause";
  const result = API.streamControlPlayPause({
    id: deviceId,
  });
  const expected: ServerRequest = {
    id: `Stream.Control.${command}`,
    method: "Stream.Control",
    params: {
      id: deviceId,
      command: command,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API streamControlPause makes request", () => {
  const deviceId = "device";
  const command = "pause";
  const result = API.streamControlPause({
    id: deviceId,
  });
  const expected: ServerRequest = {
    id: `Stream.Control.${command}`,
    method: "Stream.Control",
    params: {
      id: deviceId,
      command: command,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API streamControlPlay makes request", () => {
  const deviceId = "device";
  const command = "play";
  const result = API.streamControlPlay({
    id: deviceId,
  });
  const expected: ServerRequest = {
    id: `Stream.Control.${command}`,
    method: "Stream.Control",
    params: {
      id: deviceId,
      command: command,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API clientSetVolume makes request", () => {
  const deviceId = "device";
  const command = "Client.SetVolume";
  const result = API.clientSetVolume({
    id: deviceId,
    volume: {
      percent: 0,
      muted: false,
    },
  });
  const expected: ServerRequest = {
    id: command,
    method: command,
    params: {
      id: deviceId,
      volume: {
        percent: 0,
        muted: false,
      },
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API clientSetName makes request", () => {
  const deviceId = "device";
  const command = "Client.SetName";
  const name = "test";
  const result = API.clientSetName({
    id: deviceId,
    name,
  });
  const expected: ServerRequest = {
    id: command,
    method: command,
    params: {
      id: deviceId,
      name,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API clientSetLatency makes request", () => {
  const deviceId = "device";
  const command = "Client.SetLatency";
  const latency = 0;
  const result = API.clientSetLatency({
    id: deviceId,
    latency,
  });
  const expected: ServerRequest = {
    id: command,
    method: command,
    params: {
      id: deviceId,
      latency,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API serverDeleteClient makes request", () => {
  const deviceId = "device";
  const command = "Server.DeleteClient";
  const result = API.serverDeleteClient({
    id: deviceId,
  });
  const expected: ServerRequest = {
    id: command,
    method: command,
    params: {
      id: deviceId,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API groupSetStream makes request", () => {
  const deviceId = "device";
  const command = "Group.SetStream";
  const stream_id = "test";
  const result = API.groupSetStream({
    id: deviceId,
    stream_id,
  });
  const expected: ServerRequest = {
    id: command,
    method: command,
    params: {
      id: deviceId,
      stream_id,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API groupSetName makes request", () => {
  const deviceId = "device";
  const command = "Group.SetName";
  const name = "test";
  const result = API.groupSetName({
    id: deviceId,
    name: "test",
  });
  const expected: ServerRequest = {
    id: command,
    method: command,
    params: {
      id: deviceId,
      name,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API groupSetMute makes request", () => {
  const deviceId = "device";
  const command = "Group.SetMute";
  const mute = false;
  const result = API.groupSetMute({
    id: deviceId,
    mute,
  });
  const expected: ServerRequest = {
    id: command,
    method: command,
    params: {
      id: deviceId,
      mute,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});

test("API groupSetClients makes request", () => {
  const deviceId = "device";
  const command = "Group.SetClients";
  const clients = ["test"];
  const result = API.groupSetClients({
    id: deviceId,
    clients,
  });
  const expected: ServerRequest = {
    id: command,
    method: command,
    params: {
      id: deviceId,
      clients,
    },
    jsonrpc,
  };
  expect(result).toEqual(expected);
});
