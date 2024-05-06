let navbar = document.getElementById("navbar");

window.onscroll = () => {
    if (window.scrollY === 0) {
        //at top
        if(navbar.classList.contains("shadow")){
            navbar.classList.remove("shadow");
        }
    } else {
        //not at top
        if(!(navbar.classList.contains("shadow"))){
            navbar.classList.add("shadow");
        }
    }
};