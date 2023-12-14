let overlay = document.getElementById("loader");

//add listeners to all links
let links = document.getElementsByTagName("a");
for (i = 0; i < links.length; i++) {
    if(links[i].target != "_blank"){ //shouldn't apply to target blank links
        links[i].addEventListener('click', function(event) {
            //page change or refresh
            if(!(window.location.href.includes(this.getAttribute('href')))) {
                event.preventDefault();
                
                overlay.classList.remove("slideOff");
                overlay.classList.add("slideOn");
                setTimeout(function() {
                    overlay.classList.add("slideTime");
                    overlay.classList.remove("slideOn");
                }, 1)
    
                var current = this;
                setTimeout(function() {
                    var href = current.getAttribute('href');
                    window.location.href = href; //redirect
                }, 500);
            } else {
                event.preventDefault();
                
                overlay.classList.remove("slideOff");
                overlay.classList.add("slideReset");
                setTimeout(function() {
                    overlay.classList.add("fadeOn");
                    overlay.classList.remove("slideReset");
                }, 1)
    
                var current = this;
                setTimeout(function() {
                    var href = current.getAttribute('href');
                    window.location.href = href; //redirect
                }, 250);
            }
        });
    }
}

//hide loader
setTimeout(function() {
    if(window.location.href == document.referrer) {
        console.log("Used \"fadeOff\"");
        overlay.classList.add("fadeOff");
        setTimeout(function() {
            overlay.classList.remove("fadeOff");
            overlay.classList.add("slideOff");
        }, 500);
    } else {
        console.log("Used \"slideOff\"");
        overlay.classList.add("slideOff");
    }
}, 50);