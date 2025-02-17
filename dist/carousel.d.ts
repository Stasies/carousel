import "./styles.css";
import { SlideComponent } from "./slide";
export declare class CarouselComponent extends HTMLElement {
    #private;
    slides: Element[] | null;
    gap: number;
    initialSlides: Element[];
    rendered: boolean;
    autoplay: false | number;
    wraparound: boolean;
    _currentIndex: number;
    _breakpoints: Record<number, {
        slidesToShow: number;
        slidesToScroll: number;
    }>;
    private observer;
    private maxIndex;
    private slidesToShow;
    private slideCount;
    private slidesToScroll;
    private slideWidth;
    private isDragging;
    private startX;
    private dragOffset;
    private interval;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    set breakpoints(value: Record<number, {
        slidesToShow: number;
        slidesToScroll: number;
    }>);
    get breakpoints(): Record<number, {
        slidesToShow: number;
        slidesToScroll: number;
    }>;
    updateBreakpoints(): void;
    get currentIndex(): number;
    set currentIndex(value: number);
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): void;
    observeSlides(): void;
    startAutoPlay(): void;
    stopAutoPlay(): void;
    handleNonInfiniteScroll(step: number): void;
    prev(): void;
    next(): void;
    jump(index: number): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "carousel-component": CarouselComponent;
        "slide-component": SlideComponent;
    }
}
