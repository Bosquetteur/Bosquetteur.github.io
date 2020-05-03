particlesJS("particles-js", {"particles":{"number":{"value":70,"density":{"enable":true,"value_area":700}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":20,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":170,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":2,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"grab"},"onclick":{"enable":false,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.5}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});

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

        math.ab

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
        // execute above function
        initPhotoSwipeFromDOM('.my-gallery');
