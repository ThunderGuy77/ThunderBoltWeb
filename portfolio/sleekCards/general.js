//delete javascript warning
document.getElementById("JSWarning").remove();

//fade in all elements in order
let allFadeIn = document.querySelectorAll('.fadeIn');
let delay = 0; // delay in milliseconds

for(let i = 0; i < allFadeIn.length; i++){
    allFadeIn[i].style.opacity = 0;
    allFadeIn[i].style.transform = 'translateX(100px)';
    allFadeIn[i].style.transition = 'opacity 1s ease-out, transform 1s ease-out';
    setTimeout(function() {
        allFadeIn[i].style.opacity = 1;
        allFadeIn[i].style.transform = 'translateX(0px)';
    }, delay);
    delay += 250; // increase delay for next element
}