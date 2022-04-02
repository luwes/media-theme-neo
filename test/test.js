import { fixture, assert } from "@open-wc/testing";
import "../src/media-theme-neo.js";

describe("<media-theme-neo>", () => {
  it("has a video like API", async function () {

    const neo = await fixture(`<media-theme-neo></media-theme-neo>`);
    assert(neo instanceof HTMLElement);
  });
});
