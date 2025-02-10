import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DraggableMixin } from "./dragging";
type config = {
  slidesToShow: number;
  slidesToScroll: number;
  autoscroll?: true;
  breakpoints?: {};
  draggable?: boolean;
  wrapAround?: boolean;
  pauseOnHover?: boolean;
};

@customElement("carousel-component")
export class Carousel extends DraggableMixin(LitElement) {
  breakpoints: any;
  autoplay: number;
  interval: any;
  static styles = css`
    :host {
      display: block;
      width: 100%;
      overflow: hidden;
    }
    .carousel {
      border: 1px solid grey;
      overflow: hidden;
      display: flex;
      height: 400px;
    }
    .carousel-track {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease;
    }
  `;

  @property({ type: Number, reflect: true }) currentIndex = 0;
  @property({ type: Number }) slideWidth = 0;
  @property({ type: Number }) slidesToShow = 1.5;
  @property({ type: Number }) currentSlide = 0;
  @property({ type: Number }) nextSlide = this.currentSlide + 1;
  @property({ type: Number }) prevSlide = this.currentSlide - 1;
  @state() private slideCount = 0;

  constructor(config: config) {
    super();
    this.slideWidth = 100;
    this.autoplay = 2000;
    this.interval = null;
    this.breakpoints = config?.breakpoints || {
      1200: {
        itemsToShow: 3,
      },
      482: {
        itemsToShow: 2,
      },
      0: {
        itemsToShow: 1,
      },
    };
    this.init();
  }
  init() {
    if (this.autoplay) {
      this.startAutoPlay();
    }
  }
  startAutoPlay() {
    this.interval = setInterval(() => this.next(), this.autoplay);
  }
  stopAutoPlay() {
    clearInterval(this.interval);
  }
  firstUpdated() {
    const slot = this.shadowRoot!.querySelector("slot") as HTMLSlotElement;
    if (this.autoplay) {
      slot.addEventListener("mouseenter", () => this.stopAutoPlay());
      slot.addEventListener("mouseleave", () => this.startAutoPlay());
    }
    slot.addEventListener("slotchange", () => this.updateSlides(slot));
    window.addEventListener("resize", () => this.updateSlides(slot));
    this.updateSlides(slot);
  }
  updateSlides(slot: HTMLSlotElement) {
    const slides = slot.assignedElements({ flatten: true });
    this.slideCount = slides.length;

    for (let point in this.breakpoints) {
      if (window.innerWidth >= +point) {
        this.slidesToShow = this.breakpoints[point].itemsToShow || 3;
      }
    }

    this.slideWidth = 100 / this.slidesToShow;
    slides.forEach((slide) => {
      slide.setAttribute("style", `width: ${this.slideWidth}%`);
    });
  }
  next() {
    if (this.currentIndex < this.slideCount - this.slidesToShow) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to the first slide
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.slideCount - this.slidesToShow; // Loop to the last slide
    }
  }

  render() {
    return html`
      <div class="carousel">
        <div
          class="carousel-track"
          style="transform: translateX(-${this.currentIndex *
          this.slideWidth}%)"
        >
          <slot></slot>
        </div>
      </div>
      <div class="nav-buttons">
        <button @click="${this.prev}">Prev</button>
        <button @click="${this.next}">Next</button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "carousel-component": Carousel;
  }
}
