var w = 600;
var h = 400;
var n;
var wi;
var hi;

function setup(){
	// ...
	createCanvas(w, h).parent('canvasHolder');
	// ...
	wi = createSlider(1, 1000, 500, 1).parent('width');
	//wi.postition(20,20);	
        //hi = createSlider(1, 1000, 500, 1).parent('height');
	//hi.postition(20,40);
}

function draw() {
	ellipse(width/2, height/2, wi.value(), wi.value()); 
}
