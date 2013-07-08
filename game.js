// GB Garden game.js
// Written by dyarob for GBJam #1
// July 2013



// === Global variables for the canvas' attributes ===
var width = 320, //width of the canvas
 height = 288, //height of the canvas

  c = document.getElementById('c'), 
//canvas itself 
  ctx = c.getContext('2d');
//and two-dimensional graphic context of the
//canvas, the only one supported by all 
//browsers for now

c.width = width; //setting canvas size 
c.height = height;
// ==========




// === Cursor contexts ===
var gardenCTX = new (function(){
	this.ptab = [
				// buttons, pots
				[[56,0],[25,190]],
				[[56,0],[80,222]],
				[[56,0],[130,212]],
				[[56,0],[160, 242]],
				[[56,0],[198, 242]],
				[[56,0],[244, 224]],
				[[56,0],[292, 210]]];
	this.pId = [0,1];
	this.pMax = [6,1];

	this.X = 0; //X&Y position
	this.Y = 0;
	
	// --- methods ---
	this.setPosition = function(){
		this.X = this.ptab[this.pId[0]][this.pId[1]][0];
		this.Y = this.ptab[this.pId[0]][this.pId[1]][1];
	}
})();


var itemsMenuCTX = new (function(){
	this.ptab = [
				// colonne 1
				[[70,44],[70,92],[70,140],[70,188]],
				// colonne 2
				[[118,44],[118,92],[118,140],[118,188]],
				// colonne 3
				[[166,44],[166,92],[166,140],[166,188]],
				// colonne 4
				[[214,44],[214,92],[214,140],[214,188]],
				// colonne 5
				[[262,44],[262,92],[262,140],[262,188]]];
	this.pId = [0,0];
	this.pMax = [4,3];

	this.X = 0; //X&Y position
	this.Y = 0;
	
	// --- methods ---
	this.setPosition = function(){
		this.X = this.ptab[this.pId[0]][this.pId[1]][0];
		this.Y = this.ptab[this.pId[0]][this.pId[1]][1];
	}
})();
// ==========


// === Cursor object ===
var cursor = new (function(){
	this.img = new Image();
	this.img.src = "cursor.png";

	this.width = 16; //width of the single frame
	this.height = 16; //height of the single frame
	this.offset = 0;

	this.context = gardenCTX;

	this.draw = function(){
		try {
			ctx.drawImage(items[curItemId].img, 
						  0, 0, items[curItemId].width, items[curItemId].height,
						  this.context.X, this.context.Y - items[curItemId].offset, items[curItemId].width, items[curItemId].height);
	//cutting source image and pasting it into destination one, drawImage(Image Object, source X, source Y, source Width, source Height, destination X (X position), destination Y (Y position), Destination width, Destination height)
		} catch (e) {
	//sometimes, if character's image is too big and will not load until the drawing of the first frame, Javascript will throws error and stop executing everything. To avoid this we have to catch an error and retry painting in another frame. It is invisible for the user with 50 frames per second.
		}
	}
})();
// ==========




// === Items ===
var item1 = new (function(){
	this.img = new Image();
	this.img.src = "item1.png";

	this.width = 32; //width of the single frame
	this.height = 32; //height of the single frame
	this.offset = 16;
})();

var items = [cursor, item1];

var curItemId = 0;	// 0 = no item selected
// ==========




// === Event handler ===
window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {

	// --- LEFT ---
    case 37: // Left
		if(cursor.context.pId[0] > 0)
			--cursor.context.pId[0];
		else cursor.context.pId[0] = cursor.context.pMax[0];
    break;
    case 65: // a
		if(cursor.context.pId[0] > 0)
			--cursor.context.pId[0];
		else cursor.context.pId[0] = cursor.context.pMax[0];
    break;

	// --- RIGHT ---
    case 39: // Right
		if(cursor.context.pId[0] < cursor.context.pMax[0])
			++cursor.context.pId[0];
		else cursor.context.pId[0] = 0;
    break;
    case 68: // d
		if(cursor.context.pId[0] < cursor.context.pMax[0])
			++cursor.context.pId[0];
		else cursor.context.pId[0] = 0;
    break;

	// --- DOWN ---
    case 40: // Down
		if(cursor.context.pId[1] < cursor.context.pMax[1])
			++cursor.context.pId[1];
		else cursor.context.pId[1] = 0;
    break;
    case 83: // s
		if(cursor.context.pId[1] < cursor.context.pMax[1])
			++cursor.context.pId[1];
		else cursor.context.pId[1] = 0;
    break;

	// --- UP ---
    case 38: // Up
		if(cursor.context.pId[1] > 0)
			--cursor.context.pId[1];
		else cursor.context.pId[1] = cursor.context.pMax[1];
    break;
    case 87: // w
		if(cursor.context.pId[1] > 0)
			--cursor.context.pId[1];
		else cursor.context.pId[1] = cursor.context.pMax[1];
    break;

	
	// --- A ---
	case 96: // numpad 0
		if(cursor.context == itemsMenuCTX) {
			// calculation of the desired id based on the position of the cursor
			curItemId = cursor.context.pMax[0] * cursor.context.pId[1]
						 + (cursor.context.pId[0] +1);
			cursor.context = gardenCTX;
			cursor.context.pId = [0,1];
		}
		else if(cursor.context == gardenCTX && cursor.context.pId[1] == 0) {
			cursor.context = itemsMenuCTX;
		}
	break;
	case 188: // ,
		if(cursor.context == itemsMenuCTX) {
			// calculation of the desired id based on the position of the cursor
			curItemId = cursor.context.pMax[0] * cursor.context.pId[1]
						 + (cursor.context.pId[0] +1);
			cursor.context = gardenCTX;
			cursor.context.pId = [0,1];
		}
		else if(cursor.context == gardenCTX && cursor.context.pId[1] == 0) {
			cursor.context = itemsMenuCTX;
		}
	break;

	// --- B ---
	case 110: // numpad .
		if(curItemId != 0) {
			curItemId = 0;	// deselect current item
		}
		else if(cursor.context == itemsMenuCTX) {
			cursor.context = gardenCTX;	// exit item menu
		}
	break;
	case 190: // period .
		if(curItemId != 0) {
			curItemId = 0;	// deselect current item
		}
		else if(cursor.context == itemsMenuCTX) {
			cursor.context = gardenCTX;	// exit item menu
		}
	break;
  }
  
	cursor.context.setPosition();
	
}, false);
// ==========




// === drawing ===
var drawBG = function(){
	var BGimg = new Image();
	BGimg.src = "BGimg.png";
	try {
		ctx.drawImage(BGimg, 0, 0, 320, 288, 0, 0, 320, 288);
	} catch (e) {}
}
var drawMENU = function(){
	var MENUimg = new Image();
	MENUimg.src = "MENUimg.png";
	try {
		ctx.drawImage(MENUimg, 0, 0, 320, 288, 0, 0, 320, 288);
	} catch (e) {}
}
// ==========




// === Main loop ===
var GameLoop = function(){
	drawBG();
	if(cursor.context == itemsMenuCTX)
		drawMENU();
	cursor.context.setPosition();
    cursor.draw();
	gLoop = setTimeout(GameLoop, 100/50);
}
GameLoop();
// ==========
