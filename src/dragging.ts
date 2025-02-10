export const DraggableMixin = (BaseClass: typeof HTMLElement) =>
  class extends BaseClass {
    private isDragging = false;
    private startX = 0;
    private scrollLeftVal = 0;

    firstUpdated() {
      const carousel = this.shadowRoot?.querySelector(
        ".carousel"
      ) as HTMLElement;
      if (!carousel) return;

      carousel.addEventListener("mousedown", this.startDragging.bind(this));
      carousel.addEventListener("mousemove", this.drag.bind(this));
      carousel.addEventListener("mouseup", this.stopDragging.bind(this));
      carousel.addEventListener("mouseleave", this.stopDragging.bind(this));
    }

    startDragging(e: MouseEvent) {
      const carousel = this.shadowRoot?.querySelector(
        ".carousel"
      ) as HTMLElement;
      if (!carousel) return;

      this.isDragging = true;
      this.startX = e.pageX - carousel.offsetLeft;
      this.scrollLeftVal = carousel.scrollLeft;
    }

    drag(e: MouseEvent) {
      if (!this.isDragging) return;
      e.preventDefault();

      const carousel = this.shadowRoot?.querySelector(
        ".carousel"
      ) as HTMLElement;
      if (!carousel) return;

      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - this.startX) * 2;
      carousel.scrollLeft = this.scrollLeftVal - walk;
    }

    stopDragging() {
      this.isDragging = false;
    }
  };
