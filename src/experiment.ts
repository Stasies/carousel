import { Carousel } from "./carousel";

let config = {
  draggable: true,
  slidesToShow: 2,
  slidesToScroll: 2,
  breakpoints: {
    1000: {
      slidesToShow: 2,
      slidesToScroll: 1,
    },
    0: {
      slidesToShow: 4,
      slidesToScroll: 1,
    },
  },
};
let carousel = new Carousel(config);
