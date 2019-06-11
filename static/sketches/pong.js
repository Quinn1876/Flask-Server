var w = 600;
var h = 400;
var paddle;
var ball;
var keys;
var blocks;
var PLAYING;
var SCORE;

///////////////////////////////////////////////////////////////////////////////////////
//                      P5.JS Funtions

function setup() {
    createCanvas(w, h).parent('canvasHolder');
    paddle = new Paddle(40); // May need to change this value
    ball = new Ball(w/2, h -25);
    keys = [false,false];
    SCORE = 0;
    PLAYING = true;
}
function draw(){
    if (PLAYING) {
        clear();
        fill(255);
        rect(0, 0, w-1, h-1);
        paddle.draw(keys);
        ball.updatePosition(paddle, blocks, keys);
        ball.draw();
    } else {
        // Print the final score in big numbers across the screen
        // Save the score to the database through a call to the flask server
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

///////////////////////////////////////////////////////////////////////////

class Block {
    constructor(width) {
        this.width = width;
        this.height = 5; // This may need to be changed
        this.x = w/2;
        this.y = h - 20;
    }

    draw() {
        fill(0);
        rectMode(CORNER);
        rect(this.x, this.y, this.width, this.height);
    }

    getHitBox() {
        return [this.x, this.y, this.x + this.width, this.y + this.height]
    }
}

class Paddle extends Block{
    constructor(width) {
        super(width);
        this.XSTEP = 5;
    }

    draw(keys) {
        if (keys[0] && !keys[1]) {
            this.stepLeft();
        }
        else if (keys[1] && !keys[0]) {
            this.stepRight();
        }
        fill(0);
        rectMode(CORNER);
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

//////////////////////////////////////////////////////////////////////////////////////

class Ball {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.radius = 16;
        this.angle = 45;
        this.speed = 8;
    }

    draw() {
        ellipseMode(CENTER);
        ellipse(this.x, this.y, this.radius, this.radius);
    }

    updatePosition(paddle, blocks, keys) {
        //check if it htis a paddle
        if (collisionCheck(this.getHitBox(), paddle.getHitBox())) {
            // If keys are pressed, we are going to modify the slope when it hits the paddle
            this.angle *= -1;
            switch (paddle.isMoveing(keys)) {
                case 'r':
                    if (this.angle != 15) {
                        this.angle -= 15;
                    }
                    break;
                case 'l':
                    if (this.angle != 165) {
                           this.angle += 15;
                    }
                    break;
                default:
                    break;
            }
        }
        // Check if it hits the top wall
        else if (collisionCheck(this.getHitBox(), [0,0,w,1])) {
            this.angle *= -1;
        }
        // check the left wall
        else if (collisionCheck(this.getHitBox(), [0,0,1,h])) {
            this.angle = (this.angle * -1) + 180;
        }
        // check the right wall
        else if (collisionCheck(this.getHitBox(), [w-1,0,w,h])) {
            this.angle = (this.angle * -1) + 180;
        }
        // check if it hits the floor
        else if (collisionCheck(this.getHitBox(), [0,h-1,w,h])) {
            PLAYING = false;
        }
        //check if it hits a block
        blocks.map((block) => {
            if (collisionCheck(this.getHitBox(), block.getHitBox())) {
                block = null;
                SCORE += 10;
            }
            else{
                block = block;
            }
        });
        var win = true;
        blocks.forEach(block => {
            if (block != null) {
                win = false;
            }
        });
        if (win) {
            PLAYING = false;
        }
        this.x += this.speed*cos(radians(this.angle))
        this.y += this.speed*sin(radians(this.angle))
    }

    getHitBox() {
        return [this.x-this.radius, this.y-this.radius, this.x+this.radius, this.y+this.radius];
    }
}


function collisionCheck(hitbox1, hitbox2) {
    if (hitbox1[3] > hitbox2[0] || hitbox2[3] > hitbox1[0]) { // Check the x direction
        if (hitbox1[4] > hitbox2[1] || hitbox2[4] > hitbox1[1]) {
            return true;
        }
    }
    return false;
}
