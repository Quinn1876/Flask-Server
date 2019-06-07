var w = 600;
var h = 400;
var paddle;


function setup() {
    createCanvas(w, h).parent('canvasHolder');
    paddle = Paddle(20); // May need to change this value
}
function draw(){
    clear();
    fill(0);
    paddle.draw();
}

class Paddle{
    constructor(width) {
        this.width = width;
        this.height = 10; // This may need to be changed
        this.x = width/2;
        this.y = height - 20;
        this.XSTEP = 20;
    }

    draw() {
        rect(this.x, this.y, this.width, this.height);
    }

    stepLeft() {
        this.x -= this.XSTEP;
    }

    stepRight() {
        this.x += this.XSTEP;
    }
}

function keyPressed() {
    var curKey = key;
    if ( curKey == RIGHT ) {
        paddle.stepRight();
    }
    else if ( curKey == LEFT ) {
        paddle.stepLeft()
    }
}
