$(document).ready(function(){

    $(".nav-link.active").css("background-color","green");
    //$(".nav-pills.nav-link.active, .nav-pills.show>.nav-link").css("background-color","green")
    $(window).scroll(function(){



        if($(document).scrollTop()> 50){

            $(".navbar").css("background-color","black");
            $(".nav-link.active").css("background-color","white");
            $(".nav-link").css("background-color","transparent")

        }
        else{
            $(".navbar").css("background-color","transparent");
            $(".nav-link.active").css("background-color","green");

        }
    })
})


// Add smooth scrolling on all links inside the navbar

$("#navbar-menu a").on('click',function(event){
    if(this.hash!==""){
        event.preventDefault();

        var hash = this.hash;
        // Using jQuery's animate() method to add smooth page scroll
    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area

        $('html,body').animate({
            scrollTop:$(hash).offset().top
        },800,function(){
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash=hash;
        });
    }
}



);


particlesJS("particles-js", {"particles":{"number":{"value":70,"density":{"enable":true,"value_area":700}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":20,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":170,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":2,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"grab"},"onclick":{"enable":false,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.5}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});var count_particles, stats, update; stats = new Stats; stats.setMode(0); stats.domElement.style.position = 'absolute'; stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); count_particles = document.querySelector('.js-count-particles'); update = function() { stats.begin(); stats.end(); if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { count_particles.innerText = window.pJSDom[0].pJS.particles.array.length; } requestAnimationFrame(update); }; requestAnimationFrame(update);;
