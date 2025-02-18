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
<carousel-component
  autoplay="3000"
  wraparound="true"
  gap="8"
  pauseonhover="true"
>
  <slide-component>Slide 1</slide-component>
  <slide-component>Slide 2</slide-component>
  <slide-component>Slide 3</slide-component>
</carousel-component>
```

### Attributes

| Attribute      | Type                | Default                                     | Description                                                      |
| -------------- | ------------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `autoplay`     | `false` \| `number` | `false`                                     | `false` disables autoplay, a number sets autoplay interval in ms |
| `wrapAround`   | `boolean`           | `true`                                      | Enables infinite loop                                            |
| `breakpoints`  | `object`            | `{0: {slidesToShow: 1, slidesToScroll: 1}}` | Defines responsive breakpoints where the key is the screen width |
| `gap`          | `number`            | `0`                                         | Sets gaps between slides (in px)                                 |
| `pauseonhover` | `boolean`           | `true`                                      | `true` stops autoplay on hover                                   |

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

### Next (React) Example

```javascript
"use client";
import "@stasies/js-carousel";
import { useEffect, useRef } from "react";

export default function Carousel() {
  const carousel = useRef();
  useEffect(() => {
    carousel.current.breakpoints = {
      1200: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
      0: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    };
  });
  return (
    <carousel-component
      ref={carousel}
      gap={10}
      autoplay={2000}
      wraparound={true}
    >
      <slide-component>slide 1</slide-component>
      <slide-component>slide 2</slide-component>
      <slide-component>slide 3</slide-component>
      <slide-component>slide 4</slide-component>
      <slide-component>slide 5</slide-component>
    </carousel-component>
  );
}
```

### Nuxt (Vue) Example

```javascript
<template>
  <div class="carousel__wrapper">
    <carousel-component ref="carousel" :wraparound="true" :autoplay="false">
      <slide-component> 1 </slide-component>
      <slide-component> 2 </slide-component>
      <slide-component> 3 </slide-component>
    </carousel-component>
    <button @click="carousel.prev()">prev</button>
    <button @click="carousel.next()">next</button>
  </div>
</template>
```

<script setup lang="ts">
import "@stasies/js-carousel";
const carousel = ref();
onMounted(() => {
  carousel.value.breakpoints = {
    0: {
      slidesToShow: 1,
      slidesToScroll: 1,
    },
  };
});
</script>

```

## 📄 License

MIT License © 2025 Stasies
```
