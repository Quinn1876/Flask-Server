var w = 600;
var h = 400;
var paddle;
var keys;


function setup() {
    createCanvas(w, h).parent('canvasHolder');
    paddle = new Paddle(40); // May need to change this value
    keys = [false,false];
}
function draw(){
    clear();
    fill(0);
    paddle.draw(keys)
}

class Paddle{
    constructor(width) {
        this.width = width;
        this.height = 5; // This may need to be changed
        this.x = width/2;
        this.y = h - 20;
        this.XSTEP = 20;
    }

    draw(keys) {
        if (keys[0] && !keys[1]) {
            this.stepLeft();
        }
        else if (keys[1] && !keys[0]) {
            this.stepRight();
        }
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
    if ( keyCode == RIGHT_ARROW ) {
        keys[1] = true;
    }
    else if ( keyCode == LEFT_ARROW ) {
        keys[0] = true;
    }
}

function keyReleased() {
    if ( keyCode == RIGHT_ARROW ) {
        keys[1] = false;
    }
    else if ( keyCode == LEFT_ARROW ) {
        keys[0] = false;
    }
}
