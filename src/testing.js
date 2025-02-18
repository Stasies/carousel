"use strict";
const carousel = document.querySelector('#carousel');
document.addEventListener("DOMContentLoaded", function (event) {
    //do work
    carousel.breakpoints = {
        1200: {
            slidesToShow: 4,
            slidesToScroll: 2
        },
        0: {
            slidesToShow: 2,
            slidesToScroll: 2
        }
    };
});
