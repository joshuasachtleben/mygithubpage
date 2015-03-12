//Initialize image position
var x = 0;
var y = 0;

//Initialize canvas width and height to banner width and height
var banner = document.getElementById('banner');
var canvasWidth = banner.offsetWidth;
var canvasHeight = banner.offsetHeight;

//Get canvas element and set context
var canvas = document.getElementById('canvas');

//set canvas width and height to initial banner width and height
canvas.width = canvasWidth;
canvas.height = canvasHeight;

//Initialize mouse information
var mouseX, mouseY, mouseFollow;

//Create new image object to draw
var ufoImage = new Image();
ufoImage.src = "./images/ufo_spritesheet.png";

//Define sprite object
var sprite = function(options) {
  var sprite = {},
      frameIndex = 0, //current displayed frame
      tickCount = 0, //number of ticks since current frame displayed
      ticksPerFrame = options.ticksPerFrame || 0; //number of updates until next frame is displayed
      numberOfFrames = options.numberOfFrames || 1; // number of frames from the spritesheet. default is 1 if it isn't declared
  sprite.context = options.context;
  sprite.x = options.x;
  sprite.y = options.y;
  sprite.velocity = options.velocity;
  sprite.width = options.width;
  sprite.height = options.height;
  sprite.image = options.image;
  sprite.scale = options.scale; //multiplier for sprite scale
  sprite.disableSmoothing = options.disableSmoothing; //disables smoothing for crisp scaled pixels



  //Draws image
  sprite.render = function () {

    sprite.context.clearRect(0, 0, canvasWidth, canvasHeight);

    //if disableSmoothing true, disable the ImageSmoothingEnabled property which is true by default
    //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Controlling_image_scaling_behavior
    if(sprite.disableSmoothing) {
      sprite.context.mozImageSmoothingEnabled = false;
      sprite.context.webkitImageSmoothingEnabled = false;
      sprite.context.msImageSmoothingEnabled = false;
      sprite.context.imageSmoothingEnabled = false;
    }

    sprite.context.drawImage(
      sprite.image,                                 //source image
      frameIndex * sprite.width / numberOfFrames,   //source x
      0,                                            //source y
      sprite.width / numberOfFrames,                //source width
      sprite.height,                                //source height
      sprite.x,                                     //destination x
      sprite.y,                                     //destination y
      sprite.width / numberOfFrames * sprite.scale, //destination width
      sprite.height * sprite.scale);                //destination height
  };

  sprite.update = function(){
    tickCount += 1;
    if(tickCount > ticksPerFrame) {
      tickCount = 0;
      if(frameIndex < numberOfFrames - 1) {
        //go to next frame
        frameIndex += 1;
      } else {
        //reset frame index if loop is true
        frameIndex = 0;
      }
    }

    //update position
    //check x position
    if(sprite.x + sprite.width / numberOfFrames * sprite.scale > canvasWidth || sprite.x < 0) {
      sprite.velocity.x *= -1;
      // reset x position if out of bounds
      if(sprite.x < 0) {
        sprite.x = 0;
      } else {
        sprite.x = canvasWidth - sprite.width / numberOfFrames * sprite.scale;
      }
    }
    //check y position
    if(sprite.y + sprite.height * sprite.scale > canvasHeight || sprite.y < 0) {
      sprite.velocity.y *= -1;
      // reset y position if out of bounds
      if(sprite.y < 0) {
        sprite.y = 0;
      } else {
        sprite.y = canvasHeight - sprite.height * sprite.scale;
      }
    }

    if(mouseFollow) {
      //calculate distance between mouse and sprite
      var dx = mouseX - sprite.x - ((sprite.width / numberOfFrames * sprite.scale) / 2); //distance on x-axis
      var dy = mouseY - sprite.y - sprite.height * sprite.scale / 2 ; //distance on y-axis
      //calculate hypotenuse of triangle for direct distance
      var distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
      var steps = distance / sprite.velocity.standard;
      var xSteps = dx / steps;
      var ySteps = dy / steps;

      //move to new position
      if(steps > 1) {
        sprite.x += xSteps;
        sprite.y += ySteps;
      }

    } else {
      sprite.x += sprite.velocity.x;
      sprite.y += sprite.velocity.y;
    }

  };

  return sprite;
}

//Create ufo sprite object
var ufo = sprite({
  context: canvas.getContext("2d"),
  x: 0,
  y: 0,
  velocity: {x: randomInt(1, 5), y:randomInt(1, 5), standard: 10},
  width: 57, // image width (19) * frames (3)
  height: 9,
  scale: 2,
  image: ufoImage,
  numberOfFrames: 3,
  ticksPerFrame: 4,
  disableSmoothing: true
});

var gameLoop = function() {
  window.requestAnimationFrame(gameLoop);
  ufo.update();
  ufo.render();
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//Create an event listener to draw image after image has loaded
ufoImage.addEventListener("load", gameLoop);

//resize canvas and redraw image when window is resized
window.addEventListener("resize", function() {
  canvasWidth = banner.offsetWidth;
  canvasHeight = banner.offsetHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
});

//update mouse position on mouse move
banner.addEventListener("mousemove", function(event) {
  var rect = canvas.getBoundingClientRect();  //gets properties of element relative to viewport
  mouseX = event.clientX - rect.left;  //adjusts for any offset on the left of the element
  mouseY = event.clientY - rect.top;  //adjusts for any offset on the top of the element
  console.log("X: " + mouseX + ", Y: " + mouseY);
});

//start following mouse when mouse enters element
banner.addEventListener("mouseover", function() {
  mouseFollow = true;
});

//stop following mouse when mouse leaves element
banner.addEventListener("mouseout", function() {
  mouseFollow = false;
});
