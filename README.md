# 🚀 JS-Carousel Component

A lightweight, customizable, and performant **js-carousel**. Supports dragging functionality via `translateX`.

## ✨ Features

- **Infinite scrolling** for seamless transitions
- **Customizable slides** using `<slide-component>`
- **Draggable support** (using `translateX` for smooth motion)
- **Responsive breakpoints** for different screen sizes
- **Autoplay support** with configurable interval

## 📦 Installation

```sh
npm install @stasies/js-carousel
```

## 🚀 Usage

### Basic Example

```html
<carousel-component autoplay="3000" wraparound="true">
  <slide-component>Slide 1</slide-component>
  <slide-component>Slide 2</slide-component>
  <slide-component>Slide 3</slide-component>
</carousel-component>
```

### Attributes

| Attribute     | Type                | Default                                     | Description                                                      |
| ------------- | ------------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `autoplay`    | `false` \| `number` | `false`                                     | `false` disables autoplay, a number sets autoplay interval in ms |
| `wrapAround`  | `boolean`           | `true`                                      | Enables infinite loop                                            |
| `breakpoints` | `object`            | `{0: {slidesToShow: 1, slidesToScroll: 1}}` | Defines responsive breakpoints where the key is the screen width |

### JavaScript Usage

```javascript
const carousel = document.querySelector("carousel-component");
carousel.breakpoints = {
  1600: {
    slidesToShow: 3,
    slidesToScroll: 1,
  },
  0: {
    slidesToShow: 1,
    slidesToScroll: 1,
  },
};
carousel.next(); // switch to the next slide
carousel.prev(); //switch to the previous slide
carousel.jump(index); //jump to the slide with index
```

## 🎨 Styling

You can style the carousel using CSS:

```css
carousel-component {
  display: block;
  width: 100%;
  max-width: 800px;
  margin: auto;
}
```

## 📄 License

MIT License © 2025 Stasies
