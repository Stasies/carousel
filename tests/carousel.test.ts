import { beforeAll, describe, expect, it } from 'vitest';
import { elementUpdated, fixture, fixtureSync } from '@open-wc/testing';
import { html } from 'lit';
import '../src/experiment'
import { CarouselComponent } from '../src/experiment';

let el: CarouselComponent

describe('my-thing', async () => {
  it('should render when children are passed', async () => {
    el = await fixture<CarouselComponent>(html`
      <carousel-component>
      <div class="slide"></div>
      <div class="slide"></div>
      </carousel-component>
    `);
    expect(el.querySelector('.carousel-track')).toBeTruthy()
    expect(el.querySelector('.carousel-track')?.children.length).toBeGreaterThanOrEqual(2)
  });

  it('should translate on button click', async () => {
    el = fixtureSync<CarouselComponent>(html`
      <carousel-component>
      <div class="slide"></div>
      <div class="slide"></div>
      <div class="slide"></div>
      </carousel-component>
    `);

    let track = el.querySelector('.carousel-track')
    await elementUpdated(el);
    expect(track).not.toBeUndefined()

    let initialTransformValue = ''
    let transformValue = ''

    if (track) {
      initialTransformValue = window.getComputedStyle(track).transform
      transformValue = window.getComputedStyle(track).transform

      el.next()
      await elementUpdated(el);

      transformValue = window.getComputedStyle(track).transform
      expect(transformValue).not.toMatch(initialTransformValue)
    }
  });

  it('should automatically translate when autoplay is set', async () => {
    let autoplayInterval = 1000

    el = await fixture<CarouselComponent>(html`
      <carousel-component autoplay="${autoplayInterval}">
      <div class="slide"></div>
      <div class="slide"></div>
      <div class="slide"></div>
      <div class="slide"></div>
      <div class="slide"></div>
      </carousel-component>
    `);

    let track = el.querySelector('.carousel-track')
    expect(track).not.toBeUndefined()

    if (track) {
      let initialTransformValue = window.getComputedStyle(track).transform

      await new Promise((resolve) => setTimeout(resolve, autoplayInterval * 2));

      let transformValue = window.getComputedStyle(track).transform;
      expect(transformValue).not.toMatch(initialTransformValue);
    }
  })

  it('should handle invalid parameters', async () => {
    el = await fixture<CarouselComponent>(html`
      <carousel-component autoplay="invalidAutoplay" breakpoints="invalidBreakpoints" wrapAround="invalidWrapAround">
      <div class="slide"></div>
      <div class="slide"></div>
      <div class="slide"></div>
      </carousel-component>
    `);

    let track = el.querySelector('.carousel-track')
    let slide = el.querySelector('.slide')

    if (slide) {
      expect(window.getComputedStyle(slide).width).toBe('100%')
      expect(track?.children.length).toBe(3)
    }
  })

  it('should append new slides when wrapAround is true', async () => {
    el = await fixture<CarouselComponent>(html`
      <carousel-component wrapAround="${true}">
      <div class="slide">1</div>
      <div class="slide">2</div>
      <div class="slide">3</div>
      <div class="slide">4</div>
      </carousel-component>
    `);

    let track = el.querySelector('.carousel-track')
    expect(track?.children.length).toBeGreaterThan(4)
  })
});
