import { expect, test } from "bun:test";
import { convertHttpToWebsocket } from "helpers";

test("convertHttpToWebsocket converts https", () => {
  expect(convertHttpToWebsocket("https://test.com")).toEqual("wss://test.com")
})

test("convertHttpToWebsocket converts http", () => {
  expect(convertHttpToWebsocket("http://test.com")).toEqual("ws://test.com")
})

test("convertHttpToWebsocket drops path", () => {
  expect(convertHttpToWebsocket("http://test.com/dropme")).toEqual("ws://test.com")
})

test("convertHttpToWebsocket drops params", () => {
  expect(convertHttpToWebsocket("http://test.com?param=test")).toEqual("ws://test.com")
})
test("convertHttpToWebsocket drops port", () => {
  expect(convertHttpToWebsocket("http://test.com:1780")).toEqual("ws://test.com")
})