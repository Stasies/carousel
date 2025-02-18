import { beforeAll, describe, expect, it } from "vitest";
import { elementUpdated, fixture, fixtureSync } from "@open-wc/testing";
import { html } from "lit";
import "../../src/carousel";
import { CarouselComponent } from "../../src/carousel";

let el: CarouselComponent;

describe("my-thing", async () => {
  it("should render when children are passed", async () => {
    el = await fixture<CarouselComponent>(html`
      <carousel-component>
        <div class="slide"></div>
        <div class="slide"></div>
      </carousel-component>
    `);
    expect(el.querySelector(".carousel-track")).toBeTruthy();
    expect(
      el.querySelector(".carousel-track")?.children.length
    ).toBe(2);
  });

  it("should append new slides when wraparound is true", async () => {
    el = await fixture<CarouselComponent>(html`
      <carousel-component wraparound="${true}">
        <div class="slide">1</div>
        <div class="slide">2</div>
        <div class="slide">3</div>
      </carousel-component>
    `);

    let track = el.querySelector(".carousel-track");
    expect(track?.children.length).toBeGreaterThan(4);
  });
});
