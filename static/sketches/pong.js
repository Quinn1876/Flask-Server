var w = 600;
var h = 400;
var paddle;


function setup() {
    createCanvas(w, h).parent('canvasHolder');
    paddle = new Paddle(40); // May need to change this value
}
function draw(){
    clear();
    fill(0);
    paddle.draw();
}

class Paddle{
    constructor(width) {
        this.width = width;
        this.height = 5; // This may need to be changed
        this.x = width/2;
        this.y = h - 20;
        this.XSTEP = 20;
    }

    draw() {
        rect(this.x, this.y, this.width, this.height);
    }

    stepLeft() {
	if (this.x - this.XSTEP >= 0) {
       		this.x -= this.XSTEP;
	}
    }

    stepRight() {
	    if (this.x + this.width + this.XSTEP <= w) {
        	this.x += this.XSTEP;
	    }
    }
}

function keyPressed() {
    var curKey = keyCode;
    if ( keyCode == RIGHT_ARROW ) {
        paddle.stepRight();
    }
    else if ( keyCode == LEFT_ARROW ) {
        paddle.stepLeft()
    }
}
