left_img_path = "images/i-did-that-trump-point-left.png"
right_img_path = "images/i-did-that-trump-point-right.png"

left_img_url = browser.runtime.getURL(left_img_path)
right_img_url = browser.runtime.getURL(right_img_path)

const new_height = 150

//create default image, defaults to left
const trumpPic = document.createElement("img")
trumpPic.src = left_img_url

initializeImage(trumpPic);

//sets image styling and adds it to the page
function initializeImage(img) {
    if (localStorage.getItem("image_version") === "right"){
        trumpPic.src = right_img_url;
    }  

    //after default (left) image loads, do the rest
    img.onload = function () {
        //resize image to new_height height
        const scaling_value = new_height / img.naturalHeight
        img.style.height = img.naturalHeight * scaling_value + "px"
        img.style.width = "auto"

        //fix image (doesnt move when scrolling)
        img.style.position = "fixed"
        //set z position to very large so it appears
        img.style.zIndex = "9999"

        img.style.cursor = "grab"

        // Default position (bottom left)
        let savedPosition = JSON.parse(localStorage.getItem("imagePosition"));
        if (savedPosition) {
            img.style.left = savedPosition.left;
            img.style.top = savedPosition.top;
        } else {
            img.style.bottom = "10px";
            img.style.left = "10px";
        }

        // Enable drag functionality
        makeImageDraggable(img);

        //add to image
        document.body.appendChild(img)
    };
}

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

            // if image is on the right:
            if (img.offsetLeft > window.innerWidth / 2 && img.src != right_img_url) {
                swapImage("right", img);
            }
            // if image is on the left:
            else if (img.offsetLeft <= window.innerWidth / 2 && img.src != left_img_url) {
                swapImage("right", img);
            }
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            img.style.cursor = "grab";
            
            //save new position
            saveImagePosition(img);
            saveImageVersion(img);
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

function saveImageVersion(img) {
    if (img.src == left_img_url) {
        localStorage.setItem("image_version", "left");
    } else {
        localStorage.setItem("image_version", "right");
    }
}

//swaps the image being used on the page
function swapImage(side, img) {
    if (side === "left") {
        img.src = left_img_url
    }
    else if (side === "right") {
        img.src = right_img_url
    }
}