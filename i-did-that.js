image_path = "images/i-did-that-trump-point.png"
const new_height = 150

//create image
const trumpPic = document.createElement("img")
//load image from file
trumpPic.src = browser.runtime.getURL(image_path)

//after image loads, do the rest
trumpPic.onload = function () {
    //resize image to new_height height
    const scaling_value = new_height / trumpPic.naturalHeight
    trumpPic.style.height = trumpPic.naturalHeight * scaling_value + "px"
    trumpPic.style.width = "auto"
    
    //fix image (doesnt move when scrolling)
    trumpPic.style.position = "fixed"
    //set z position to very large so it appears
    trumpPic.style.zIndex = "9999"

    trumpPic.style.cursor = "grab"

    // Default position (bottom left)
    let savedPosition = JSON.parse(localStorage.getItem("imagePosition"));
    if (savedPosition) {
        trumpPic.style.left = savedPosition.left;
        trumpPic.style.top = savedPosition.top;
    } else {
        trumpPic.style.bottom = "10px";
        trumpPic.style.left = "10px";
    }

    
    // Enable drag functionality
    makeImageDraggable(trumpPic);

    //add to image
    document.body.appendChild(trumpPic)
};

// Dragging functionality
function makeImageDraggable(img) {
    let offsetX, offsetY, isDragging = false;

    img.addEventListener("mousedown", (event) => {
        event.preventDefault();
        isDragging = true;
        offsetX = event.clientX - img.getBoundingClientRect().left;
        offsetY = event.clientY - img.getBoundingClientRect().top;
        img.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (event) => {
        if (isDragging) {
            img.style.left = event.clientX - offsetX + "px";
            img.style.top = event.clientY - offsetY + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            img.style.cursor = "grab";
            saveImagePosition(img);
        }
    });

    img.ondragstart = () => false; // Prevent default drag behavior
}

// Save position in local storage
function saveImagePosition(img) {
    localStorage.setItem("imagePosition", JSON.stringify({
        left: img.style.left,
        top: img.style.top
    }));
}