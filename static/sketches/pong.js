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
    blocks = new Blocks();
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
    constructor(width, x, y) {
        this.width = width;
        this.height = 5; // This may need to be changed
        this.x = x;
        this.y = y;
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

class Blocks {
    constructor() {
        this.blocks = [];
        this.generateBlocks();
    }

    draw() {
        this.blocks.forEach(block => {
            block.draw();
        });
    }

    getBlocks() {
        return this.blocks;
    }

    generateBlocks() {

        for(var i = 0; i < w-20; i += 20) {
            for(var j = 0; j < 90; i += 5)
                this.blocks.push(new Block(20, i, j))
        }
    }

    blockBreak(hitBoxBall, center) {
        /* return values
                1
        --------------
        |           |
      4 |           | 2
        |           |
        -------------
                3
        */
        this.blocks.map(block => {
        hitbox = block.getHitBox()
        if (hitBoxBall[2] > hitbox[0] || hitbox[2] > hitBoxBall[0]) {
            if (hitBoxBall[3] > hitbox[1] || hitbox[3] > hitBoxBall[1]) {
                block = null;
                if (center.x < hitbox[0]) return 4;
                else if (center.x > hitbox[2]) return 2;
                else if (center.y > hitbox[1]) return 1;
                else if (center.y < hitbox[3]) return 3;
            }
            else {
                block = block;
            }
        }
       });

       return 0;
    }
}


class Paddle extends Block{
    constructor(width) {
        super(width, w/2, h-20);
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
        blocks.blockBreak(this.getHitBox(), this.getCenter());
        checkWin(blocks);
        this.x += this.speed*cos(radians(this.angle));
        this.y += this.speed*sin(radians(this.angle));
    }

    getHitBox() {
        return [this.x-this.radius, this.y-this.radius, this.x+this.radius, this.y+this.radius];
    }

    getCenter() {
        return {x : this.x, y : this.y};
    }
}


function collisionCheck(hitbox1, hitbox2) {
    if (hitbox1[2] > hitbox2[0] || hitbox2[2] > hitbox1[0]) { // Check the x direction
        if (hitbox1[3] > hitbox2[1] || hitbox2[3] > hitbox1[1]) {
            return true;
        }
    }
    return false;
}

function checkBlocks(blocks) {
    var win = true;
        blocks.forEach(block => {
            if (block != null) {
                win = false;
            }
        });
        if (win) {
            PLAYING = false;
        }
}
