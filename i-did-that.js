//desired image height
const new_height = 150

//make right version of image
left_image_path = "images/i-did-that-trump-point-left.png"
right_image_path = "images/i-did-that-trump-point-right.png"

//create image object
const trumpPic = document.createElement("img")
//load appropriate image (default side is left)
if (localStorage.getItem("image_version") === null || localStorage.getItem("image_version") === "left"){
    trumpPic.src = browser.runtime.getURL(left_image_path)
    initializeImage(trumpPic);
} //load right size image if flagged
else if (localStorage.getItem("image_version") === "right"){
    trumpPic.src = browser.runtime.getURL(right_image_path)
    initializeImage(trumpPic);
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
        img.style.zIndex = Number.MAX_SAFE_INTEGER;

        img.style.cursor = "grab"

        //default position (bottom left)
        let savedPosition = JSON.parse(localStorage.getItem("imagePosition"));
        if (savedPosition) {
            img.style.left = savedPosition.left;
            img.style.top = savedPosition.top;
        } else {
            img.style.bottom = "10px";
            img.style.left = "10px";
        }

        //enable drag functionality
        makeImageDraggable(img);

        //add to page
        document.body.appendChild(img)
    };
}

//dragging functionality
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

            //if the image changed sides (left/right), we need to replace it with the mirrored version
            //if image is on the right:
            if (img.offsetLeft > window.innerWidth / 2){
                swapImage("right", img);
                //save new position
                saveImagePosition(img);
            }
            //if image is on the left:
            else if (img.offsetLeft <= window.innerWidth /2){
                swapImage("left", img);
                //save new position
                saveImagePosition(img);
            }
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            img.style.cursor = "grab";
        }
    });

    //prevent default drag behavior
    img.ondragstart = () => false; 
}

//save position in local storage
function saveImagePosition(img) {
    localStorage.setItem("imagePosition", JSON.stringify({
        left: img.style.left,
        top: img.style.top
    }));
}

//swaps the image being used on the page by changing image source
//also changes stored flag for image being used
function swapImage(side, img) {
    if (side === "left"){
        img.src = browser.runtime.getURL(left_image_path)
        localStorage.setItem("image_version", "left");
    }
    else if (side === "right"){
        img.src = browser.runtime.getURL(right_image_path)
        localStorage.setItem("image_version", "right");
    }
}