//scroll behavior
function scrollCondition() {
    let button = document.getElementById('themeButton');
    let scrollPosition = window.scrollY;
    let windowHeight = window.innerHeight;
    let documentHeight = document.body.clientHeight;

    //bottom of page
    if (Math.ceil(scrollPosition + windowHeight) >= documentHeight) {
        button.style.backgroundColor = 'black';
    } else {
        button.style.backgroundColor = '#f44233';
    }
}

window.addEventListener('scroll', function() {
    scrollCondition();
});

//theme toggle
function toggleTheme() {
    let bodyElement = document.getElementsByTagName("body")[0];

    let moonIcon = document.getElementById("moonIcon");
    let sunIcon = document.getElementById("sunIcon");

    if(inDarkMode()){
        //change to regular
        bodyElement.classList.remove("dark");

        //remove dark class from all elements
        var allElements = document.getElementsByTagName("*");
        for (var i = 0; i < allElements.length; i++) {
            allElements[i].classList.remove("dark");
        }

        //change icon
        moonIcon.classList.add("iconActive");
        sunIcon.classList.remove("iconActive");

        //save in local storage
        localStorage.setItem('theme', 'light');
    } else {
        //change to dark
        bodyElement.classList.add("dark");

        //remove dark class from all elements
        var allElements = document.getElementsByTagName("*");
        for (var i = 0; i < allElements.length; i++) {
            allElements[i].classList.add("dark");
        }
        
        //change icon
        moonIcon.classList.remove("iconActive");
        sunIcon.classList.add("iconActive");

        //save in local storage
        localStorage.setItem('theme', 'dark');
    }
}

function inDarkMode() {
    let bodyElement = document.getElementsByTagName("body")[0];
    return bodyElement.classList.contains("dark");
}

//run automatically
scrollCondition();
if(localStorage.getItem("theme") == "dark") {
    toggleTheme();
}