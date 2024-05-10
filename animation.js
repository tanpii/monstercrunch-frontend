"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const products = document.querySelector(".products");
  const product = document.querySelectorAll(".product");
  const newElement = document.querySelector(".rotate-button");
  const allElements = [...product, newElement];
  var currentDegree = 0;
  allElements.forEach(item => {
    item.addEventListener("click", function(event) {
      let titleIn;
      let titleOut;
      let itemIn;
      let itemOut;
      let outValue = "-100%";
      let inValue = "5%";
      if (window.innerWidth < 1025) {
        outValue = "-100%";
        inValue = "10%";
      }
      switch (currentDegree % 360) {
        case 0:
          itemOut = document.getElementById("ginger-cat");
          itemIn = document.getElementById("lovely-puppy");
          titleIn = document.getElementById("name__lovely-puppy");
          titleOut = document.getElementById("name__ginger-cat");
          itemIn.style.opacity = 1;
          itemOut.style.opacity = 0;
          titleOut.style.right = outValue;
          titleIn.style.right = inValue;
          break;
        case 90:
          itemOut = document.getElementById("lovely-puppy");
          itemIn = document.getElementById("lazy-kitten");
          titleIn = document.getElementById("name__lazy-kitten");
          titleOut = document.getElementById("name__lovely-puppy");
          itemIn.style.opacity = 1;
          itemOut.style.opacity = 0;
          titleOut.style.right = outValue;
          titleIn.style.right = inValue;
          break;
        case 180:
          itemOut = document.getElementById("lazy-kitten");
          itemIn = document.getElementById("choco-dog");
          titleIn = document.getElementById("name__choco-dog");
          titleOut = document.getElementById("name__lazy-kitten");
          itemIn.style.opacity = 1;
          itemOut.style.opacity = 0;
          titleOut.style.right = outValue;
          titleIn.style.right = inValue;
          break;
        case 270:
          itemOut = document.getElementById("choco-dog");
          itemIn = document.getElementById("ginger-cat");
          titleIn = document.getElementById("name__ginger-cat");
          titleOut = document.getElementById("name__choco-dog");
          itemIn.style.opacity = 1;
          itemOut.style.opacity = 0;
          titleOut.style.right = outValue;
          titleIn.style.right = inValue;
          break;
      }
      currentDegree += 90;
      products.style.transform = "rotate(" + currentDegree + "deg)";
    });
  });
  
  const newImages = [
    'images/cookie1.png',
    'images/cookie2.png',
    'images/cookie3.png',
  ];

  const cookie__1 = document.querySelector('.cookie__1');
  const cookie__2 = document.querySelector('.cookie__2');
  const cookie__3 = document.querySelector('.cookie__3');
  const cookie__4 = document.querySelector('.cookie__4');
  let currentImageIndex = 0;

  function changeImage() {
      cookie__1.src = newImages[currentImageIndex];
      setTimeout(function() {
          cookie__2.src = newImages[currentImageIndex];
          setTimeout(function() {
              cookie__3.src = newImages[currentImageIndex];
              setTimeout(function() {
                  cookie__4.src = newImages[currentImageIndex];
                  currentImageIndex = (currentImageIndex + 1) % newImages.length;
                  setTimeout(changeImage, 1000);
              }, 300);
          }, 300);
      }, 300);
  }
  changeImage();

  document.addEventListener('mousemove', e => {
    Object.assign(document.documentElement, {
      style: `
      --move-x: ${(e.clientX) * .005}px;
      --move-y: ${(e.clientY) * .009}px;
      `
    })
  }); 
});

jQuery(document).ready(function($) {
  "use strict";
  $('#why-we-carousel').owlCarousel({
    loop: true,
    center: true,
    autoWidth: true,
    autoplay: true,
    dots: true,
    nav: true,
    autoplayTimeout: 5000,
    smartSpeed: 450,
    navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
    responsive: {
      0: {
        items: 1.2,
      },
      425: {
        items: 1.5,
      },
      768: {
        items: 2
      },
      1170: {
        items: 3
      }
    }
  });
});