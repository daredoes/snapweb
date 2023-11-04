import { expect, test } from "bun:test";
import { convertHttpToWebsocket, replaceUrlHostAndPort } from "src/helpers";

test("convertHttpToWebsocket converts https", () => {
  expect(convertHttpToWebsocket("https://test.com")).toEqual("wss://test.com/");
});

test("convertHttpToWebsocket converts http", () => {
  expect(convertHttpToWebsocket("http://test.com")).toEqual("ws://test.com/");
});

test("convertHttpToWebsocket keeps path", () => {
  expect(convertHttpToWebsocket("http://test.com/dropme")).toEqual(
    "ws://test.com/dropme",
  );
});

test("convertHttpToWebsocket drops params", () => {
  expect(convertHttpToWebsocket("http://test.com?param=test")).toEqual(
    "ws://test.com/",
  );
});
test("convertHttpToWebsocket drops port", () => {
  expect(convertHttpToWebsocket("http://test.com:1780")).toEqual(
    "ws://test.com:1780/",
  );
});

test("replaceUrlHostAndPort works with http", () => {
  expect(
    replaceUrlHostAndPort(
      "http://0.0.0.0:6680/local/884e6e48595d8dfa79bea9a694ce09e1-715x715.jpeg",
      "http://example.com",
    ),
  ).toEqual(
    "http://example.com/local/884e6e48595d8dfa79bea9a694ce09e1-715x715.jpeg",
  );
});

test("replaceUrlHostAndPort works with https", () => {
  expect(
    replaceUrlHostAndPort(
      "http://0.0.0.0:6680/local/884e6e48595d8dfa79bea9a694ce09e1-715x715.jpeg",
      "https://example.com",
    ),
  ).toEqual(
    "https://example.com/local/884e6e48595d8dfa79bea9a694ce09e1-715x715.jpeg",
  );
});

test("replaceUrlHostAndPort works with http and port", () => {
  expect(
    replaceUrlHostAndPort(
      "http://0.0.0.0:6680/local/884e6e48595d8dfa79bea9a694ce09e1-715x715.jpeg",
      "http://example.com",
      1234,
    ),
  ).toEqual(
    "http://example.com:1234/local/884e6e48595d8dfa79bea9a694ce09e1-715x715.jpeg",
  );
});
