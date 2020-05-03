// particlesJS("particles-js", {"particles":{"number":{"value":70,"density":{"enable":true,"value_area":700}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":20,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":170,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":2,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"grab"},"onclick":{"enable":false,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.5}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});

var blocMenu = document.getElementById("particles-js");
var blocAbout = document.getElementById("test");

blocMenu.style.height=blocAbout.clientHeight + "px";

var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};


var images = [{
        url: "https://live.staticflickr.com/65535/39137209301_190a0b77c9.jpg",
        caption: "toto"
    },
    {
        url: "https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm7.staticflickr.com/6175/6176698785_7dee72237e_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm6.staticflickr.com/5023/5578283926_822e5e5791_m.jpg",
        caption: "toto"
    },
    {
        url: "https://live.staticflickr.com/65535/39137209301_190a0b77c9.jpg",
        caption: "toto"
    },
    {
        url: "https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm7.staticflickr.com/6175/6176698785_7dee72237e_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm6.staticflickr.com/5023/5578283926_822e5e5791_m.jpg",
        caption: "toto"
    },
    {
        url: "https://live.staticflickr.com/65535/39137209301_190a0b77c9.jpg",
        caption: "toto"
    },
    {
        url: "https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm7.staticflickr.com/6175/6176698785_7dee72237e_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm6.staticflickr.com/5023/5578283926_822e5e5791_m.jpg",
        caption: "toto"
    },
    {
        url: "https://live.staticflickr.com/65535/39137209301_190a0b77c9.jpg",
        caption: "toto"
    },
    {
        url: "https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm7.staticflickr.com/6175/6176698785_7dee72237e_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm6.staticflickr.com/5023/5578283926_822e5e5791_m.jpg",
        caption: "toto"
    },
    {
        url: "https://live.staticflickr.com/65535/39137209301_190a0b77c9.jpg",
        caption: "toto"
    },
    {
        url: "https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm7.staticflickr.com/6175/6176698785_7dee72237e_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm6.staticflickr.com/5023/5578283926_822e5e5791_m.jpg",
        caption: "toto"
    },
    {
        url: "https://live.staticflickr.com/65535/39137209301_190a0b77c9.jpg",
        caption: "toto"
    },
    {
        url: "https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm7.staticflickr.com/6175/6176698785_7dee72237e_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm6.staticflickr.com/5023/5578283926_822e5e5791_m.jpg",
        caption: "toto"
    },
    {
        url: "https://live.staticflickr.com/65535/39137209301_190a0b77c9.jpg",
        caption: "toto"
    },
    {
        url: "https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm7.staticflickr.com/6175/6176698785_7dee72237e_m.jpg",
        caption: "toto"
    },
    {
        url: "https://farm6.staticflickr.com/5023/5578283926_822e5e5791_m.jpg",
        caption: "toto"
    }
];

var gallery = $(".js-slideshow__slides")[0];



for (var image of images) {

    var figureElement = $("<figure></figure>",{
        "itemprop": "associatedMedia",
        "itemscope":"",
        "itemtype": "http://schema.org/ImageObject"
    });

    var linkElement = $("<a></a>",{
        "itemprop": "contentUrl",
        "data-size":"1024x1024",
    });

    var imageElement = $("<img>",{
        "itemprop" : "thumbnail",
        "src" : image.url,
        "alt" : image.caption
    });

    var figCaptionElement = $("<figcaption></figcaption>",{
        "itemprop" : "caption description",
    });
    figCaptionElement.text(image.caption);


    imageElement.appendTo(linkElement);
    linkElement.appendTo(figureElement);
    figCaptionElement.appendTo(figureElement);

    figureElement.appendTo(gallery);
}




function clickSlide() {
  const clickPos = event.clientX / window.innerWidth;
  if (clickPos >= 0.5) {
    incImage(1);
  } else {
    incImage(-1);
  }
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
      console.log("timed out, finishing setup");
      finishSetup();
    }
  }, 8000);

  imageArray.forEach((img, index) => {
    // if image is cached, i--, else i-- when image finishes loading
    if (img.complete) {
      i--;
      console.log(`${index} was cached`);
    } else {
      console.log(`creating onload for ${index}`);
      img.onload = function() {
        i--;
        console.log(`${index} loaded`);
        console.log(`i = ${i}`);
        if (i <= 0) {
          console.log("finishing setup");
          finishSetup();
        }
      };
    }

    // wait until remaining images are loaded then finish setup
    if (i <= 0) {
      console.log("finishing setup");
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
  console.log("SETUP COMPLETE, HAVE A NICE DAY");
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
// let autoUpdate = setInterval(() => {
//   incImage();
// }, slideSpeed);
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



// execute above function
initPhotoSwipeFromDOM(".js-slideshow__slides");
