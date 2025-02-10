import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Carousel } from "./carousel";

@customElement("slide-component")
export class Slide extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      flex: 0 0 auto;
      box-sizing: border-box;
    }
  `;
  connectedCallback() {
    super.connectedCallback();

    // Traverse up the DOM to find the parent Carousel
    const carousel = this.parentElement?.closest(
      "carousel-component"
    ) as Carousel;
    if (carousel) {
      console.log("Found carousel:", carousel);
      // Now you can call methods on the carousel
    } else {
      console.error("Carousel not found!");
    }
  }

  render() {
    return html`
      <div class="slide">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "slide-component": Slide;
  }
}
