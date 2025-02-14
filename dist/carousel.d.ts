export declare class CarouselComponent extends HTMLElement {
    #private;
    slides: Element[] | null;
    config: any;
    _currentIndex: number;
    maxIndex: number;
    breakpoints?: {
        [key: number]: any;
    };
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
    get currentIndex(): number;
    set currentIndex(value: number);
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): void;
    startAutoPlay(): void;
    stopAutoPlay(): void;
    handleNonInfiniteScroll(step: number): void;
    prev(): void;
    next(): void;
    jump(index: number): void;
}
