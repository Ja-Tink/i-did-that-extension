image_path = "images/i-did-that-trump-point-left.png"
const new_height = 150

//create default (left) image
const trumpPic = document.createElement("img")
trumpPic.src = browser.runtime.getURL(image_path)

//make right version of image
mirror_path = "images/i-did-that-trump-point-right.png"
const rightPic = document.createElement("img")
rightPic.src = browser.runtime.getURL(mirror_path)

//load appropriate image:
//default side is left
if (localStorage.getItem("image_version") === undefined || localStorage.getItem("image_version") === "left"){
    initializeImage(trumpPic);
} //load right size image if flagged
else if (localStorage.getItem("image_version") === "right"){
    initializeImage(rightPic);
}  

//sets image styling and adds it to the page
function initializeImage(img){
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
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            img.style.cursor = "grab";

            //if the image changed sides (left/right), we need to replace it with the mirror
            let newImg
            // if image is on the right:
            if (img.offsetLeft > window.innerWidth / 2){
                newImg = swapImage("right", img);
            }
            // if image is on the left:
            else if (img.offsetLeft <= window.innerWidth /2){
                newImg = swapImage("left", img);
            }
            //save new position
            saveImagePosition(newImg);
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

//swaps the image being used on the page
function swapImage(side, oldImage) {
    if (side === "left"){
        //set all styling to that of the old image
        trumpPic.style.left = oldImage.style.left;
        trumpPic.style.top = oldImage.style.top;
        trumpPic.style.position = "fixed";
        trumpPic.style.zIndex = "9999";
        trumpPic.style.cursor = "grab";
        //resize image to appropriate height
        const scaling_value = new_height / trumpPic.naturalHeight
        trumpPic.style.height = trumpPic.naturalHeight * scaling_value + "px"
        trumpPic.style.width = "auto"
        //make draggable and replace the old image
        makeImageDraggable(trumpPic);
        oldImage.parentNode.replaceChild(trumpPic, oldImage);
        //set side in storage
        localStorage.setItem("image_version", "left");
        return trumpPic;
    }
    else if (side === "right"){
        //take old styling
        rightPic.style.left = oldImage.style.left;
        rightPic.style.top = oldImage.style.top;
        rightPic.style.position = "fixed";
        rightPic.style.zIndex = "9999";
        rightPic.style.cursor = "grab";
        //resize mirror image
        const mirror_scaling_value = new_height / rightPic.naturalHeight
        rightPic.style.height = rightPic.naturalHeight * mirror_scaling_value + "px"
        rightPic.style.width = "auto"
        //make draggable and replace old image
        makeImageDraggable(rightPic);
        oldImage.parentNode.replaceChild(rightPic, oldImage);
        //set side in storage
        localStorage.setItem("image_version", "right");
        return rightPic;
    }
}