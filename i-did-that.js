image_path = "images/placeholder.jpg"
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

    //setting position (bottom left) based on image size
    trumpPic.style.bottom = "0px"
    trumpPic.style.left = "0px"
    
    //adding clickable functionality
    trumpPic.onclick = function() {
        moveImage(trumpPic)
    };

    //add to image
    document.body.appendChild(trumpPic)
};

//moves image to left/right side
function moveImage (img) {
    if (img.style.left != ""){
        img.style.left = ""
        img.style.right = "0px"
    }
    else{
        img.style.right = ""
        img.style.left = "0px"
    }
};