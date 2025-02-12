import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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
export class Carousel extends LitElement {
  breakpoints: any;
  autoplay: number | false;
  interval: any;
  wrapAround: boolean;
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
      user-select: none;
    }
    .transition {
      transition: transform 0.3s ease;
    }
  `;

  @property({ type: Number, reflect: true }) _currentIndex = 1;
  @property({ type: Number }) maxIndex = 1;
  @property({ type: Array<Element> }) slides: Element[] | null = null;
  @property({ type: Number }) slideWidth = 0;
  @property({ type: Number }) slidesToShow = 1.5;
  @property({ type: Number }) slidesToScroll = 1;
  @state() isTransitioning = true;
  @state() private slideCount = 0;
  @state() private isDragging = false;
  @state() private startX = 0;
  @state() private dragOffset = 0;

  constructor(config: config) {
    super();
    this.slideWidth = 100;
    this.wrapAround = false
    this.autoplay = 2000;
    this.interval = null;
    this.breakpoints = config?.breakpoints || {
      0: {
        itemsToShow: 1,
        itemsToScroll: 1
      },
    };
  }
  get currentIndex() {
    return this._currentIndex
  }
  set currentIndex(value: number) {
    this._currentIndex = Math.min(Math.max(value, 0), this.maxIndex);
    this.#updateSlideClasses()
  }
  startAutoPlay() {
    if (this.autoplay && typeof this.autoplay == 'number') {
      this.interval = setInterval(() => this.next(), this.autoplay);
    }
  }
  stopAutoPlay() {
    clearInterval(this.interval);
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("mousedown", this.#onDragStart);
    this.addEventListener("touchstart", this.#onDragStart, { passive: true });
    this.addEventListener("mousemove", this.#onDragMove);
    this.addEventListener("touchmove", this.#onDragMove, { passive: true });
    this.addEventListener("mouseup", this.#onDragEnd);
    this.addEventListener("mouseleave", this.#onDragEnd);
    this.addEventListener("touchend", this.#onDragEnd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("mousedown", this.#onDragStart);
    this.removeEventListener("touchstart", this.#onDragStart);
    this.removeEventListener("mousemove", this.#onDragMove);
    this.removeEventListener("touchmove", this.#onDragMove);
    this.removeEventListener("mouseup", this.#onDragEnd);
    this.removeEventListener("mouseleave", this.#onDragEnd);
    this.removeEventListener("touchend", this.#onDragEnd);
  }
  firstUpdated() {
    const slot = this.shadowRoot!.querySelector("slot") as HTMLSlotElement;
    const assignedSlides = slot.assignedElements({ flatten: true });

    this.#setUpAutoplay()

    slot.addEventListener("slotchange", () => { this.#setupSlides(assignedSlides); this.#updateResponsiveSettings(slot) });
    window.addEventListener("resize", () => this.#updateResponsiveSettings(slot));
    this.#updateResponsiveSettings(slot);

    this.currentIndex = this.wrapAround ? Math.floor(this.slidesToShow) : 0;
    this.slideCount = assignedSlides.length;
    this.maxIndex = this.wrapAround ? this.slideCount : Math.max(this.slideCount - this.slidesToShow, 0);

  }
  #onDragStart(e: MouseEvent | TouchEvent) {
    this.stopAutoPlay()
    this.slidesToScroll = 1
    this.isDragging = true;
    this.startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    this.dragOffset = 0;
  }
  #onDragMove(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    const currentX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    this.dragOffset = currentX - this.startX;
    if (this.currentIndex >= this.maxIndex && this.dragOffset < 0 || this.currentIndex <= 0 && this.dragOffset > 0) {
      this.dragOffset = 0
    }
    const track = this.shadowRoot?.querySelector(".carousel-track") as HTMLElement;
    if (track) {
      track.style.transform = `translateX(calc(-${this.currentIndex * this.slideWidth}% + ${this.dragOffset}px))`;
    }
  }
  #onDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;

    const threshold = this.slideWidth / 3; // Minimum pixels to trigger slide change
    if (Math.abs(this.dragOffset) > threshold) {
      if (this.dragOffset < 0) {
        this.next()
      } else if (this.currentIndex > 0) {
        this.prev()
      }
    }
  }
  #setUpAutoplay() {
    if (!this.autoplay) return
    const carousel = this.shadowRoot!.querySelector(".carousel") as HTMLElement;
    this.startAutoPlay()
    carousel.addEventListener("mouseenter", () => this.stopAutoPlay());
    carousel.addEventListener("mouseleave", () => this.startAutoPlay());
  }
  #setupSlides(assignedSlides: Element[]) {
    const firstClones = assignedSlides.slice(0, Math.floor(this.slidesToShow)).map((el) => el.cloneNode(true)) as Element[];
    const lastClones = assignedSlides.slice(-Math.floor(this.slidesToShow)).map((el) => el.cloneNode(true)) as Element[];
    this.slides = this.wrapAround ? [...lastClones, ...assignedSlides, ...firstClones] : assignedSlides;
    this.#updateSlideClasses();

  }
  #updateSlideClasses() {
    this.slides?.forEach((slide, index) => {
      if (!(slide instanceof HTMLElement)) return;

      let status = "";
      if (index === this.currentIndex) {
        status = "current";
      } else if (index === this.currentIndex - 1) {
        status = "prev";
      } else if (index === this.currentIndex + 1) {
        status = "next";
      }

      slide.setAttribute("status", status);
    });
  }
  #updateResponsiveSettings(slot?: HTMLSlotElement) {
    for (let point in this.breakpoints) {
      if (window.innerWidth >= +point) {
        this.slidesToShow = this.breakpoints[point].itemsToShow || 1;
        this.slidesToScroll = this.breakpoints[point].itemsToScroll || this.breakpoints[point].itemsToShow || 1;
      }
    }
    this.slideWidth = 100 / this.slidesToShow;
    this.slides?.forEach((slide) => {
      slide.setAttribute("style", `width: ${this.slideWidth}%`);
    });
    this.requestUpdate()
  }
  #resetScroll(indexVal: number) {
    setTimeout(() => {
      this.isTransitioning = false;
      this.currentIndex = indexVal;
      setTimeout(() => {
        this.isTransitioning = true;
      }, 50);
    }, 300);
  }
  prev() {
    if (!this.wrapAround) {
      this.#handleNonInfiniteScroll(-this.slidesToShow)
      return
    }
    const maxLeftScroll = this.slidesToShow
    if (this.currentIndex <= maxLeftScroll) {
      this.currentIndex -= this.slidesToScroll;
      this.#resetScroll(this.currentIndex + this.slideCount)
    } else {
      this.currentIndex -= this.slidesToScroll;
    }
    this.requestUpdate();
  }
  next() {
    if (!this.wrapAround) {
      this.#handleNonInfiniteScroll(this.slidesToShow)
      return
    }
    const maxRightScroll = this.slideCount - this.slidesToScroll
    if (this.currentIndex >= maxRightScroll) {
      this.currentIndex += this.slidesToScroll;
      this.#resetScroll(this.currentIndex - this.slideCount)
    } else {
      this.currentIndex += this.slidesToScroll;
    }
    this.requestUpdate();
  }
  #handleNonInfiniteScroll(step: number) {
    this.currentIndex += step
    this.requestUpdate()
  }
  jump(index: number) {
    this.currentIndex = index + Math.floor(this.slidesToShow)
    this.requestUpdate()
  }


  render() {
    return html`
      <div class="carousel">
        <div
          class="carousel-track ${this.isTransitioning ? 'transition' : ''}"
          style="transform: translateX(-${this.currentIndex *
      this.slideWidth}%)"
        >
        ${this.slides?.map(
        (slide) => html`${slide}`
      )}
      <slot hidden></slot>
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
