import "./styles.css";
import { SlideComponent } from "./slide";
import { isInvalidBreakpoints } from "./validator";
export class CarouselComponent extends HTMLElement {
  slides: Element[] | null;
  gap: number;
  rendered: boolean;
  autoplay: false | number;
  wraparound: boolean;
  private initialSlides: Element[];
  private _currentIndex: number;
  private _breakpoints: Record<
    number,
    { slidesToShow: number; slidesToScroll: number }
  >;
  private observer: MutationObserver | null = null;
  private maxIndex: number;
  private slidesToShow: number;
  private slideCount: number;
  private slidesToScroll: number;
  private slideWidth: number;
  private isDragging: boolean;
  private startX: number;
  private dragOffset: number;
  private interval: ReturnType<typeof setInterval> | null;

  constructor() {
    super();
    this.initialSlides = [];
    this.rendered = false;
    this._breakpoints = {};
    this.autoplay = false;
    this.wraparound = false;
    this.slides = [];
    this.interval = null;
    this.gap = 0;
    this.slideWidth = 100;
    this.slideCount = 0;
    this._currentIndex = 0;
    this.maxIndex = 0;
    this.slidesToShow = 1;
    this.slidesToScroll = 1;
    this.isDragging = false;
    this.startX = 0;
    this.dragOffset = 0;
  }
  #setupStyles() {
    const style = document.createElement("style");
    style.textContent = `
    carousel-component{
      display: block;
      height: 100%;
      width: 100%;
    }
    .carousel {
      overflow: hidden;
      display: flex;
      height: 100%;
    }
    .carousel-track {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      user-select: none;
      gap: ${this.gap}px
    }
    .transition {
      transition: transform 0.3s ease;
    }
    `;
    document.head.appendChild(style);
  }

  static get observedAttributes() {
    return ["autoplay", "wraparound", "gap"];
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "autoplay":
        this.autoplay = parseInt(newValue, 10) || false;
        this.startAutoPlay();
        break;
      case "wraparound":
        this.wraparound = newValue.match(/true|false/)
          ? JSON.parse(newValue)
          : false;
        break;
      case "gap":
        this.gap = +newValue || 0;
        break;
    }
  }
  set breakpoints(
    value: Record<number, { slidesToShow: number; slidesToScroll: number }>
  ) {
    if (!isInvalidBreakpoints(value)) {
      this._breakpoints = value;
    }
    this.updateBreakpoints();
  }

  get breakpoints() {
    return this._breakpoints;
  }

  updateBreakpoints() {
    this.#setResponsiveDisplayOptions();
    this.#initializeCarousel();
  }
  get currentIndex() {
    return this._currentIndex;
  }
  set currentIndex(value: number) {
    this._currentIndex = Math.min(Math.max(value, 0), this.maxIndex);
    this.#handleTranslate();
    this.#updateSlideClasses();
  }
  #initializeCarousel() {
    this.#setupSlides();
    this.render();
    this.#updateResponsiveSettings();
    this.#setupIndex();
  }
  connectedCallback() {
    this.#setupStyles();
    this.observeSlides();
    this.#initializeCarousel();
    this.updateBreakpoints()
    this.#setupEventListeners();
  }
  disconnectedCallback() {
    this.#removeEventListeners();
  }
  render() {
    this.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.classList.add("carousel");

    const track = document.createElement("div");
    track.classList.add("carousel-track", "transition");

    this.slides?.forEach((node) => track.appendChild(node));
    wrapper.appendChild(track);
    this.appendChild(wrapper);
  }
  #setupSlides() {
    const track = this.querySelector(".carousel-track");
    if (!track) {
      this.initialSlides = Array.from(this.children);
    }
    this.slideCount = this.initialSlides.length;

    const firstClones = this.initialSlides
      .slice(0, Math.floor(this.slidesToShow))
      .map((el) => el.cloneNode(true)) as Element[];
    const lastClones = this.initialSlides
      .slice(-Math.floor(this.slidesToShow))
      .map((el) => el.cloneNode(true)) as Element[];

    this.slides = this.wraparound
      ? [...lastClones, ...this.initialSlides, ...firstClones]
      : this.initialSlides;
  }
  observeSlides() {
    const callback: MutationCallback = (mutationsList, observer) => {
      this.observer?.disconnect();
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node: Node) => {
            if (
              (node as Element).classList &&
              (node as Element).classList.contains("slide")
            ) {
              this.initialSlides.push(node as Element);
              this.#initializeCarousel();
            }
          });
        }
      }
    };
    this.observer = new MutationObserver(callback);
    this.observer.observe(this, { childList: true, subtree: true });
  }
  #setResponsiveDisplayOptions() {
    for (let point in this.breakpoints) {
      if (window.innerWidth >= +point) {
        this.slidesToShow = this.breakpoints[+point].slidesToShow || 1;
        this.slidesToScroll =
          this.breakpoints[+point].slidesToScroll ||
          this.breakpoints[+point].slidesToShow ||
          1;
      }
    }
  }
  #updateResponsiveSettings() {
    this.slideWidth =
      (this.clientWidth - this.gap * (this.slidesToShow - 1)) /
      this.slidesToShow;

    this.slides?.forEach((slide) => {
      (slide as HTMLDivElement).style.width = `${this.slideWidth}px`;
    });
  }
  #setupIndex() {
    this.maxIndex = this.wraparound
      ? this.slideCount
      : Math.max(this.slideCount - this.slidesToShow, 0);
    this.currentIndex = this.wraparound ? Math.floor(this.slidesToShow) : 0;
  }
  #setupEventListeners() {
    this.addEventListener("mousedown", this.#onDragStart);
    this.addEventListener("touchstart", this.#onDragStart, { passive: true });
    this.addEventListener("mousemove", this.#onDragMove);
    this.addEventListener("touchmove", this.#onDragMove, { passive: true });
    this.addEventListener("mouseup", this.#onDragEnd);
    this.addEventListener("mouseleave", this.#onDragEnd);
    this.addEventListener("touchend", this.#onDragEnd);
    window.addEventListener("resize", () => this.updateBreakpoints());

    this.startAutoPlay();
    this.addEventListener("mouseenter", () => this.stopAutoPlay());
    this.addEventListener("mouseleave", () => this.startAutoPlay());
  }
  #removeEventListeners() {
    this.removeEventListener("mousedown", this.#onDragStart);
    this.removeEventListener("touchstart", this.#onDragStart);
    this.removeEventListener("mousemove", this.#onDragMove);
    this.removeEventListener("touchmove", this.#onDragMove);
    this.removeEventListener("mouseup", this.#onDragEnd);
    this.removeEventListener("mouseleave", this.#onDragEnd);
    this.removeEventListener("touchend", this.#onDragEnd);
  }
  #onDragStart(e: MouseEvent | TouchEvent) {
    this.stopAutoPlay();
    this.slidesToScroll = 1;
    this.isDragging = true;
    this.startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    this.dragOffset = 0;
  }
  #onDragMove(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    const currentX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    this.dragOffset = currentX - this.startX;
    if (
      (this.currentIndex >= this.maxIndex && this.dragOffset < 0) ||
      (this.currentIndex <= 0 && this.dragOffset > 0)
    ) {
      this.dragOffset = 0;
    }
    const track = this.querySelector(".carousel-track") as HTMLElement;
    if (track) {
      track.style.transform = `translateX(-${this.currentIndex * (this.slideWidth + this.gap) - this.dragOffset
        }px `;
    }
  }
  #onDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;

    const threshold = 50;
    if (Math.abs(this.dragOffset) > threshold) {
      if (this.dragOffset < 0) {
        this.next();
      } else if (this.currentIndex > 0) {
        this.prev();
      }
    }
  }
  startAutoPlay() {
    if (this.autoplay) {
      this.interval = setInterval(() => this.next(), this.autoplay);
    }
  }
  stopAutoPlay() {
    clearInterval(this.interval!);
  }
  #handleTranslate() {
    let track = this.querySelector(".carousel-track") as HTMLDivElement;
    track.style.transform = `translateX(-${this.currentIndex * (this.slideWidth + this.gap)
      }px)`;
  }
  #updateSlideClasses() {
    this.slides?.forEach((slide, index) => {
      if (!(slide instanceof HTMLElement)) return;
      slide.classList.remove("prev", "current", "next", "hidden");
      if (index === this.currentIndex) {
        slide.classList.add("current");
      } else if (index === this.currentIndex - 1) {
        slide.classList.add("prev");
      } else if (index === this.currentIndex + 1) {
        slide.classList.add("next");
      }
      if (
        index < this.currentIndex ||
        index > this.currentIndex + this.slidesToShow
      ) {
        slide.classList.add("hidden");
      }
    });
  }
  handleNonInfiniteScroll(step: number) {
    this.currentIndex += step;
    if (this.maxIndex == this.currentIndex) {
      this.stopAutoPlay();
    }
  }
  #resetScroll(indexVal: number) {
    let track = this.querySelector(".carousel-track");
    setTimeout(() => {
      track?.classList.remove("transition");
      this.currentIndex = indexVal;
      setTimeout(() => {
        track?.classList.add("transition");
      }, 50);
    }, 300);
  }
  prev() {
    if (!this.wraparound) {
      this.handleNonInfiniteScroll(-this.slidesToScroll);
      return;
    }
    if (this.currentIndex <= 1) {
      this.currentIndex -= this.slidesToScroll;
      this.#resetScroll(this.currentIndex + this.slideCount);
    } else {
      this.currentIndex -= this.slidesToScroll;
    }
  }
  next() {
    if (!this.wraparound) {
      this.handleNonInfiniteScroll(this.slidesToScroll);
      return;
    }
    const maxRightScroll = this.slideCount - this.slidesToScroll;
    if (this.currentIndex >= maxRightScroll) {
      this.currentIndex += this.slidesToScroll;
      this.#resetScroll(this.currentIndex - this.slideCount);
    } else {
      this.currentIndex += this.slidesToScroll;
    }
  }
  jump(index: number) {
    this.currentIndex = index + Math.floor(this.slidesToShow);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "carousel-component": CarouselComponent;
    "slide-component": SlideComponent;
  }
}
// customElements.define("carousel-component", CarouselComponent);

(function registerWebComponent() {
  if (!customElements.get("carousel-component")) {
    customElements.define("carousel-component", CarouselComponent);
    customElements.define("slide-component", SlideComponent);
  }
})();
