/// <reference lib="dom" />
import { test, expect } from "bun:test";
import WebAudioController from "./WebAudioController";

test.todo("dom test", () => {
  const controller = WebAudioController.getInstance();
  expect(controller.getPlayState()).toEqual("none");
});
