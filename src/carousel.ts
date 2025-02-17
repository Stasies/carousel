import "./styles.css";
import { SlideComponent } from "./slide";
import { ConfigValidator, isInvalidBreakpoints } from "./validator";
export class CarouselComponent extends HTMLElement {
  private observer: MutationObserver | null = null;
  slides: Element[] | null;
  initialSlides: Element[];
  rendered: boolean;
  config: any;
  autoplay: false | number;
  wraparound: boolean;
  _currentIndex: number;
  _breakpoints: Record<
    number,
    { slidesToShow: number; slidesToScroll: number }
  >;
  maxIndex: number;
  slidesToShow: number;
  slideCount: number;
  slidesToScroll: number;
  slideWidth: number;
  isDragging: boolean;
  startX: number;
  dragOffset: number;
  interval: ReturnType<typeof setInterval> | null;

  constructor(...config: any) {
    super();
    this.initialSlides = [];
    this.rendered = false;
    this._breakpoints = {};
    this.autoplay = false;
    this.wraparound = false;
    this.slides = [];
    this.interval = null;
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
      gap: 8px;
    }
    .transition {
      transition: transform 0.3s ease;
    }
    .slide{
      height: 100%;
      flex: 0 0 auto;
      box-sizing: border-box;
    }
    `;
    document.head.appendChild(style);
  }

  static get observedAttributes() {
    return ["autoplay", "wraparound", "breakpoints"];
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
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
    console.log(this.currentIndex);
  }
  #initializeCarousel() {
    console.log("initialising");
    this.#setupSlides();
    this.render();
    this.#updateResponsiveSettings();
    this.#setupIndex();
  }
  connectedCallback() {
    this.#setupStyles();
    this.observeSlides();
    this.#initializeCarousel();
    this.#setupEventListeners();
  }
  disconnectedCallback() {
    this.#removeEventListeners();
  }
  render() {
    // if (this.querySelector(".carousel")) return;
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
    this.slideWidth = 100 / this.slidesToShow;
    this.slides?.forEach((slide) => {
      (slide as any).setAttribute("style", `width: ${this.slideWidth}%`);
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
      track.style.transform = `translateX(calc(-${
        this.currentIndex * this.slideWidth
      }% + ${this.dragOffset}px))`;
    }
  }
  #onDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;

    const threshold = this.slideWidth / 3;
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
    track.style.transform = `translateX(-${
      this.currentIndex * this.slideWidth
    }%)`;
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
        index < this.currentIndex - 1 ||
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

customElements.define("slide-component", SlideComponent);
customElements.define("carousel-component", CarouselComponent);
