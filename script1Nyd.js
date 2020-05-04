// particlesJS("particles-js", {"particles":{"number":{"value":70,"density":{"enable":true,"value_area":700}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":20,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":170,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":2,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"grab"},"onclick":{"enable":false,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.5}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});

var blocMenu = document.getElementById("particles-js");
var blocAbout = document.getElementById("test");

blocMenu.style.height=blocAbout.clientHeight + "px";



var images = [{
        src: "https://live.staticflickr.com/65535/49680399226_57731c7913_k.jpg",
        title: "martin pecheur",
        w : 2047,
        h: 1363
    },
    {
        src: "https://live.staticflickr.com/65535/49677322661_910f102f21_k.jpg",
        title: "Diamant mandarin",
        w : 2048,
        h: 1362
    },
    {
        src: "https://live.staticflickr.com/65535/49553527026_d91b4fa5a5_k.jpg",
        title: "Guêpier d'Europe",
        w : 1363,
        h: 2047
    }
];

var images = [...Array(10).keys()].reduce((acc,value)=>{ acc.push(... images);return acc; },[]);

var gallery = $(".js-slideshow__slides")[0];

for (var image of images) {

    var imageElement = $("<img>",{
        "itemprop" : "thumbnail",
        "src" : image.src,
        "alt" : image.title
    });

    imageElement.appendTo(gallery);
}




function clickSlide() {
  var gallery = new PhotoSwipe(  document.querySelectorAll('.pswp')[0] , PhotoSwipeUI_Default, images,{
      index: whichImage
  });
  gallery.init();
}

function handleOverlap(newImage) {
  toggleEventListeners(0);
  setTimeout(() => {
    toggleTransition(0);
    whichImage = newImage;
    updateImage();
    setTimeout(() => {
      toggleTransition(1);
      toggleEventListeners(1);
    }, 200);
  }, slideTransition);
}

function detectOverlap() {
  const minImage = overlap;
  const maxImage = imageArray.length - overlap - 1;
  const moveBy = imageArray.length - overlap * 2;
  updateImage();
  if (whichImage > maxImage) {
    handleOverlap(whichImage - moveBy);
  } else if (whichImage < minImage) {
    handleOverlap(whichImage + moveBy);
  }
}

function incImage(incAmount = 1) {
  whichImage += incAmount;
  detectOverlap();
}

function createDopplegangers(ovr) {
  const slides = slideshowSlides.children;
  const cloneStart = [];
  const cloneEnd = [];
  for (let i = 0; i < ovr; i++) {
    cloneStart.push(slides[i].cloneNode(true));
    cloneEnd.push(slides[slides.length - 1 - i].cloneNode(true));
  }
  cloneStart.forEach(clone => {
    slideshowSlides.appendChild(clone);
  });
  cloneEnd.forEach(clone => {
    slideshowSlides.insertBefore(clone, slideshowSlides.children[0]);
  });
}

function handleImageLoading() {
  let i = imageArray.length;

  // possibly remove this setTimeout
  setTimeout(() => {
    if (i > 0) {
      finishSetup();
    }
  }, 8000);

  imageArray.forEach((img, index) => {
    // if image is cached, i--, else i-- when image finishes loading
    if (img.complete) {
      i--;
    } else {
      img.onload = function() {
        i--;
        if (i <= 0) {
          finishSetup();
        }
      };
    }

    // wait until remaining images are loaded then finish setup
    if (i <= 0) {
      finishSetup();
    }
  });
}

function finishSetup() {
  updateWidthArray();
  createThumbs();
  window.addEventListener("resize", function() {
    updateWidthArray();
    updateImage();
    updateThumbsWidth();
  });
  slideshowSlides.addEventListener("click", clickSlide);
  updateImage();
}

function updateWidthArray() {
  imageArray.forEach((img, index) => {
    imageWidthArray[index] = img.width + imageGap;
  });
}

function updateThumbsWidth() {
  const visibleThumbs = imageArray.length;
  const thumbSize =
    window.getComputedStyle(slideshow).getPropertyValue("--thumb-size") * 1;
  const thumbsWidth =
    visibleThumbs * thumbSize + (visibleThumbs - 1) * imageGap;
  slideshow.style.setProperty("--thumbs-width", thumbsWidth);
}

function createThumbs() {
  const thumbsWrapper = document.createElement("div");
  const thumbsDiv = document.createElement("div");
  thumbsWrapper.classList.add("js-slideshow__thumbs-wrapper");
  thumbsDiv.classList.add("js-slideshow__thumbs");

  imageArray.forEach((img, index) => {
    const imageClone = img.cloneNode(true);
    const imageFigure = document.createElement("figure");
    imageFigure.classList.add("js-slideshow__thumb-image");
    imageFigure.addEventListener("click", () => {
      whichImage = index;
      detectOverlap();
      updateImage();
    });
    imageFigure.appendChild(imageClone);
    thumbsDiv.appendChild(imageFigure);
  });

  thumbsWrapper.appendChild(thumbsDiv);
  slideshow.appendChild(thumbsWrapper);
  updateThumbsWidth();
}

function toggleTransition(val) {
  const offsetTime = val * slideTransition / 1000 + "s";
  slideshow.style.setProperty("--offset-time", offsetTime);
}

function toggleEventListeners(toggle) {
  if (toggle === 0) {
    slideshowSlides.removeEventListener("click", clickSlide);
    slideshowSlides.removeEventListener("touchstart", handleTouchStart, false);
    slideshowSlides.removeEventListener("touchmove", handleTouchMove, false);
  } else {
    slideshowSlides.addEventListener("click", clickSlide);
    slideshowSlides.addEventListener("touchstart", handleTouchStart, false);
    slideshowSlides.addEventListener("touchmove", handleTouchMove, false);
  }
}

function getImagePos(arr, index) {
  const modIndex = index % arr.length;

  if (modIndex > 0) {
    const leftArray = arr.slice(0, modIndex);
    return (
      leftArray.reduce((total, amount) => total + amount) + arr[modIndex] * 0.5
    );
  } else {
    return arr[modIndex] * 0.5;
  }
}

function updateImage() {
  const thumbs = document.querySelectorAll(
    "#jsSlideshow .js-slideshow__thumb-image"
  );
  clearInterval(autoUpdate);
  autoUpdate = setInterval(() => {
    incImage();
  }, slideSpeed);
  const newOffset = getImagePos(imageWidthArray, whichImage);
  slideshow.style.setProperty("--offset", newOffset + "px");
  thumbs.forEach(thumb => {
    thumb.classList.remove("js-slideshow__thumb-image--selected");
  });
  thumbs[whichImage].classList.add("js-slideshow__thumb-image--selected");
  // thumbs[whichImage].scrollIntoView({
  //   behavior: "auto",
  //   block: "center",
  //   inline: "center"
  // });
}

const slideshow = document.querySelector("#jsSlideshow");
const slideshowSlides = slideshow.querySelector(".js-slideshow__slides");
const slideSpeed = slideshow.dataset.speed * 1000;
const slideTransition = slideshow.dataset.transition * 1000;
const overlap = 3; // how many images are duplicated at beginning & end
let whichImage = overlap;
let autoUpdate = setInterval(() => {
  incImage();
}, slideSpeed);
createDopplegangers(overlap);
const imageArray = slideshowSlides.querySelectorAll("img");
const imageGap =
  window.getComputedStyle(slideshow).getPropertyValue("--image-gap") * 1;
const imageWidthArray = [];
handleImageLoading();
toggleTransition(1);

// swipe gestures from https://stackoverflow.com/questions/15084675/how-to-implement-swipe-gestures-for-mobile-devices
slideshowSlides.addEventListener("touchstart", handleTouchStart, false);
slideshowSlides.addEventListener("touchmove", handleTouchMove, false);
var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }
  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;
  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      incImage(1);
    } else {
      incImage(-1);
    }
  }

  xDown = null;
  yDown = null;
}


// define options (if needed)
var options = {
    // optionName: 'option value'
    // for example:
    index: 0 // start at first slide
};
