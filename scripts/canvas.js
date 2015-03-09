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

//Create new image object to draw
var ufoImage = new Image();
ufoImage.src = "../images/ufo_spritesheet.png";

//Define sprite object
var sprite = function(options) {
  var sprite = {},
      frameIndex = 0, //current displayed frame
      tickCount = 0, //number of ticks since current frame displayed
      ticksPerFrame = options.ticksPerFrame || 0; //number of updates until next frame is displayed
      numberOfFrames = options.numberOfFrames || 1; // number of frames from the spritesheet. default is 1 if it isn't declared
  sprite.context = options.context;
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
      sprite.image,                               //source image
      frameIndex * sprite.width / numberOfFrames, //source x
      0,                                          //source y
      sprite.width / numberOfFrames,              //source width
      sprite.height,                              //source height
      0,                                          //destination x
      0,                                          //destination y
      sprite.width / numberOfFrames * sprite.scale,              //destination width
      sprite.height * sprite.scale);                             //destination height
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
  };

  return sprite;
}

//Create ufo sprite object
var ufo = sprite({
  context: canvas.getContext("2d"),
  width: 57, // image width (19) * frames (3)
  height: 9,
  scale: 1,
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

//Create an event listener to draw image after image has loaded
ufoImage.addEventListener("load", gameLoop);

//resize canvas and redraw image when window is resized
window.addEventListener("resize", function() {
  canvasWidth = banner.offsetWidth;
  canvasHeight = banner.offsetHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
});
