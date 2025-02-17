import "./styles.css";
export declare class CarouselComponent extends HTMLElement {
    #private;
    private observer;
    slides: Element[] | null;
    initialSlides: Element[];
    rendered: boolean;
    config: any;
    autoplay: false | number;
    wraparound: boolean;
    _currentIndex: number;
    _breakpoints: Record<number, {
        slidesToShow: number;
        slidesToScroll: number;
    }>;
    maxIndex: number;
    slidesToShow: number;
    slideCount: number;
    slidesToScroll: number;
    slideWidth: number;
    isDragging: boolean;
    startX: number;
    dragOffset: number;
    interval: ReturnType<typeof setInterval> | null;
    constructor(...config: any);
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
