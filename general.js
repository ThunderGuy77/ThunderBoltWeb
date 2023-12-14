//dropdown code
function toggleDropdown(dropdownRow) {
    dropdownRow.classList.toggle("open");
    const content = dropdownRow.nextElementSibling;
    const arrow = dropdownRow.querySelector(".dropdownArrow");

    
    if (dropdownRow.classList.contains("open")) {
        content.style.maxHeight = content.scrollHeight + "px";
        content.classList.add("open");
        arrow.style.transform = "rotate(180deg)";
    } else {
        content.style.maxHeight = null;
        content.classList.remove("open");
        arrow.style.transform = "rotate(0deg)";
    }

    content.addEventListener("transitionend", function() {
        if (!dropdownRow.classList.contains("open")) {
            content.style.maxHeight = "0";
        }
    });
}

//copy link code
function copyLink() {
    const url = window.location.href;
    const copyToClipboard = (text) => {
      const type = 'text/plain';
      const blob = new Blob([text], {type});
      const data = [new ClipboardItem({[type]: blob})];
      navigator.clipboard.write(data);
    };
    copyToClipboard(url);

    const ogButton = document.getElementById("copyText");
    ogButton.textContent = "Copied!";
  }

//gallery expanding code
const galleryOverlay = document.getElementById("galleryOverlay");

document.querySelectorAll('.flexGallery .imgBox').forEach(box => {
    box.addEventListener('click', () => {
        box.classList.add('active');
        galleryOverlay.classList.add('active');
    });
});

window.addEventListener('click', e => {
    if (!e.target.closest('.imgBox.active')) {
        document.querySelectorAll('.flexGallery .imgBox').forEach(box => {
            box.classList.remove('active');
            galleryOverlay.classList.remove('active');
        });
    }
});