/*
* range-slider.js
*
* Created on: Nov 20, 2025
* Author: Ch-Tima
*/

let slidTrak = undefined;

let thumbLeft = {
    slider: undefined, // Slider (jQuery)
    sliderText: undefined, //Show text (jQuery)
    gloabalThumbPosX: 0, //Global Slider Position on Cordenate X
    isDragging: false //Drag and drop flag
}
let thumbRight = {
    slider: undefined,
    sliderText: undefined,
    gloabalThumbPosX: 0,
    isDragging: false
}

let minVal = 0;
let maxVal = 100;
const minGap = 1;

//Init and load DOM
$(function(){
    console.log("init range-slider.js");
    
    minVal = 1950;
    maxVal = new Date().getFullYear();

    slidTrak = $(".slider-track");//Slider Track

    //Left/Right Slider
    thumbLeft.slider = $("#slider-btn-left"); 
    thumbRight.slider = $("#slider-btn-right");
    //Left/Right TextBox
    thumbLeft.sliderText = $("#left-slide-text");
    thumbLeft.sliderText.text(minVal);
    thumbRight.sliderText = $("#right-slide-text");
    thumbRight.sliderText.text(maxVal);

    // Event handlers for the left slider
    $(thumbLeft.slider).on("mousedown touchstart", function(e){
        e.preventDefault();
        thumbLeft.isDragging = true;//Activate drag
        //Calculating the global position relative to the page
        thumbLeft.gloabalThumbPosX = parseInt($(thumbLeft.slider).css("left")) + $(slidTrak).offset().left;
    });
    
    // Event handlers for the right slider
    $(thumbRight.slider).on("mousedown touchstart", function(e){
        e.preventDefault();
        thumbRight.isDragging = true;
        thumbRight.gloabalThumbPosX = parseInt($(thumbRight.slider).css("left")) + $(slidTrak).offset().left;
    });

    //Mouse/touch movement handler for drag
    $(document).on("mousemove touchmove", function(e){
        if(thumbLeft.isDragging == true) {
            updateSliderThumb(e, thumbLeft);
        }

        if(thumbRight.isDragging == true) {
            updateSliderThumb(e, thumbRight);
        }
    });

    $(document).on("mouseup touchend", function () {
        //Disable drag and drop
        thumbLeft.isDragging = false;
        thumbRight.isDragging = false;
    });

});

/**
* Function for calculating and updating the slider position
* @param {Event} e - mouse/touch event
* @param {Object} thumbObj - slider object (thumbLeft or thumbRight)
*/
function updateSliderThumb(e, thumbObj){
    //Current cursor position (mouse or finger)
    const currentX = (e == undefined || e == null) ? 0 : (e.touches ? e.touches[0].clientX : e.clientX);
    const deltaX = getDeltaX(currentX, thumbObj);
    const year = Math.round(minVal+(deltaX/slidTrak.width())*(maxVal-minVal));

    if(deltaX < 0){
        return;
    }

    if(deltaX >= slidTrak.width()){
        return;
    }

    
    if(thumbObj === thumbLeft){
        console.log("thumbLeft");
        const yearRight = Math.round(minVal+(getDeltaX(thumbRight.gloabalThumbPosX, thumbRight)/slidTrak.width())*(maxVal-minVal));
        if(yearRight-year < minGap) return;
    }


    if(thumbObj === thumbRight){
        console.log("thumbRight");
        const yearLeft = Math.round(minVal+(getDeltaX(thumbLeft.gloabalThumbPosX, thumbLeft)/slidTrak.width())*(maxVal-minVal));
        if(year-yearLeft < minGap) return;
    }

    //Update DOM
    $(thumbObj.slider).css("left", deltaX + 'px');

    thumbObj.sliderText.text(year);

    thumbObj.gloabalThumbPosX = currentX;
}

function getDeltaX(currentX, thumbObj){
    //Current left offset of the thumb in pixels
    let deltaX = parseInt($(thumbObj.slider).css("left"));
    //Apply cursor movement to the thumb position
    deltaX += currentX-thumbObj.gloabalThumbPosX;
    return deltaX;
}

