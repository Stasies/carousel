import "./styles.css";
import { SlideComponent } from "./slide";
import { isInvalidBreakpoints } from "./validator";
export class CarouselComponent extends HTMLElement {
    slides;
    gap;
    rendered;
    autoplay;
    wraparound;
    pauseonhover;
    initialSlides;
    _currentIndex;
    _breakpoints;
    observer = null;
    maxIndex;
    slidesToShow;
    slideCount;
    slidesToScroll;
    slideWidth;
    isDragging;
    startX;
    dragOffset;
    interval;
    constructor() {
        super();
        this.initialSlides = [];
        this.rendered = false;
        this._breakpoints = {};
        this.autoplay = false;
        this.pauseonhover = true;
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
        return ["autoplay", "wraparound", "gap", "pauseonhover"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "autoplay":
                this.autoplay = parseInt(newValue, 10) || false;
                break;
            case "wraparound":
                this.wraparound = newValue.match(/true|false/)
                    ? JSON.parse(newValue)
                    : false;
                break;
            case "gap":
                this.gap = +newValue || 0;
                break;
            case "pauseonhover":
                this.pauseonhover = newValue.match(/true|false/)
                    ? JSON.parse(newValue)
                    : true;
                break;
        }
    }
    set breakpoints(value) {
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
    set currentIndex(value) {
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
            .map((el) => el.cloneNode(true));
        const lastClones = this.initialSlides
            .slice(-Math.floor(this.slidesToShow))
            .map((el) => el.cloneNode(true));
        this.slides = this.wraparound
            ? [...lastClones, ...this.initialSlides, ...firstClones]
            : this.initialSlides;
    }
    observeSlides() {
        const callback = (mutationsList, observer) => {
            this.observer?.disconnect();
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList &&
                            node.classList.contains("slide")) {
                            this.initialSlides.push(node);
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
            slide.style.width = `${this.slideWidth}px`;
        });
    }
    #setupIndex() {
        this.maxIndex = this.wraparound
            ? (this.slides?.length || this.slideCount)
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
        if (this.autoplay) {
            this.startAutoPlay();
        }
        if (this.pauseonhover) {
            this.addEventListener("mouseenter", () => this.stopAutoPlay());
            this.addEventListener("mouseleave", () => this.startAutoPlay());
        }
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
    #onDragStart(e) {
        this.stopAutoPlay();
        this.slidesToScroll = 1;
        this.isDragging = true;
        this.startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        this.dragOffset = 0;
    }
    #onDragMove(e) {
        if (!this.isDragging)
            return;
        const currentX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        this.dragOffset = currentX - this.startX;
        if ((this.currentIndex >= this.maxIndex && this.dragOffset < 0) ||
            (this.currentIndex <= 0 && this.dragOffset > 0)) {
            this.dragOffset = 0;
        }
        const track = this.querySelector(".carousel-track");
        if (track) {
            track.style.transform = `translateX(-${this.currentIndex * (this.slideWidth + this.gap) - this.dragOffset}px `;
        }
    }
    #onDragEnd() {
        if (!this.isDragging)
            return;
        this.isDragging = false;
        const threshold = 50;
        if (Math.abs(this.dragOffset) > threshold) {
            if (this.dragOffset < 0) {
                this.next();
            }
            else if (this.currentIndex > 0) {
                this.prev();
            }
        }
    }
    startAutoPlay() {
        if (this.autoplay) {
            this.interval = setInterval(() => this.next(), this.autoplay);
        }
        else {
            this.stopAutoPlay();
        }
    }
    stopAutoPlay() {
        clearInterval(this.interval);
    }
    #handleTranslate() {
        let track = this.querySelector(".carousel-track");
        track.style.transform = `translateX(-${this.currentIndex * (this.slideWidth + this.gap)}px)`;
    }
    #updateSlideClasses() {
        this.slides?.forEach((slide, index) => {
            if (!(slide instanceof HTMLElement))
                return;
            slide.classList.remove("prev", "current", "next", "hidden");
            if (index === this.currentIndex) {
                slide.classList.add("current");
            }
            else if (index === this.currentIndex - 1) {
                slide.classList.add("prev");
            }
            else if (index === this.currentIndex + 1) {
                slide.classList.add("next");
            }
            if (index < this.currentIndex ||
                index > this.currentIndex + this.slidesToShow) {
                slide.classList.add("hidden");
            }
        });
    }
    handleNonInfiniteScroll(step) {
        this.currentIndex += step;
        if (this.maxIndex == this.currentIndex) {
            this.stopAutoPlay();
        }
    }
    #resetScroll(indexVal) {
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
        }
        else {
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
        }
        else {
            this.currentIndex += this.slidesToScroll;
        }
    }
    jump(index) {
        this.currentIndex = index + Math.floor(this.slidesToShow);
    }
}
const globalObject = typeof window !== 'undefined' ? window : global;
globalObject.HTMLElement = window.HTMLElement;
globalObject.HTMLDivElement = window.HTMLDivElement;
if (!customElements.get("carousel-component")) {
    customElements.define("carousel-component", CarouselComponent);
}
if (!customElements.get("slide-component")) {
    customElements.define("slide-component", SlideComponent);
}
