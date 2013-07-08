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



// ===== OBJECTS =====

// === Buttons ===
// --- Constructor ---
function Button(position) {
	this.position = position;
}
var itemButton = new Button([56,0]);
// ==========



// === ITEMS ===
function Item(position) {

	// --- attributes ---
	this.position = position;
	this.img = new Image();
	this.img.src = "item1.png";
	this.width = 32; //width of the single frame
	this.height = 32; //height of the single frame
	this.offset = 16;
	// - Growth attributes -
	this.mature = 0;
	this.maxSize = 4;
	this.stalkSPRT = new Image();
	this.stalkSPRT.src = "item1_stalk.png";	// let's assume it's 16*16
	
	// --- methods ---
	this.sow = function() {	// semer
		// must make a small sprout appear
		
	}
}

//var item1 = new Item([70,44]);

var items = [new Item([70,44]),new Item([70,92]),new Item([70,140]),new Item([70,188]),
			new Item([118,44]),new Item([118,92]),new Item([118,140]),new Item([118,188]),
			new Item([166,44]),new Item([166,92]),new Item([166,140]),new Item([166,188]),
			new Item([214,44]),new Item([214,92]),new Item([214,140]),new Item([214,188]),
			new Item([262,44]),new Item([262,92]),new Item([262,140]),new Item([262,188])]
			
var curItemId = 100;	// 100 = no item selected
// ==========



// === POTS ===
// --- Constructor ---
function Pot(position, size) {

	// --- attributes ---
	this.position = position;
	this.size = size; // 1 = small (1 tile wide); 2 = medium (2t); 3 = big (3t)
	this.crop = 100;	// 100 = nothing
	this.crop2 = new Crop(this, items[0]);	
	this.signPosition = [this.position[0] - 16, this.position[1] - 10];
	
	// --- methods ---
	this.setCrop = function(id) {
		this.crop = id;
	}
	this.setCrop2 = function(crop) {
		this.crop2 = crop;
	}
	
	this.drawSign = function() {
		if(this.crop != 100) {
			try {
				ctx.drawImage(items[0].img, 
							0, 0, items[0].width, items[0].height,
							this.signPosition[0], this.signPosition[1] + items[0].offset, 
							items[0].width, items[0].height);
			} catch (e) {}
		}
	}
}
var pots = [new Pot([25,190]),new Pot([80,222]),
			new Pot([130,212]),new Pot([160, 242]),
			new Pot([198, 242]),new Pot([244, 224]),
			new Pot([292, 210])]
// ==========



// === CROPS ===
// --- Constructor ---
function Crop(pot, item) {
	// --- Attributes ---
	this.pot = pot;	// pot of the plant (for position and pot size)
	this.item = item;	// from what seed is it (contain the growth algorithm and sprites etc)
	// - State save -
	// LIST of plant segments with positions and sprites
	this.saveState = [];
	
	// --- Methods ---
	this.sprout = function() {
		// must make a small sprout appear
		this.saveState.push(new Stalk(this.pot.position, item.stalkSPRT));
	}
	this.grow = function() {	// repeat until full growth (maxSize times)
		// grow the plant by one step
	}
	this.draw = function() {	// to draw AFTER the pots (no risks of drawing above the pot)
		var i;
		for(i=0; i<this.saveState.length; ++i) {
			this.saveState[i].draw();
		}
	}
}

// --- Stalk ---
function Stalk(position, img) {	// to add later: sprite id for plants with more than just one sprite
	this.position = position;
	this.img = img;
	
	this.draw = function() {
		try {
			ctx.drawImage(this.img, 
						0, 0, 16, 16,
						this.position[0]-8, this.position[1]-8, 
						16, 16);
		} catch (e) {}
	}
}
// ==========
// ===============




// === Cursor contexts ===
var gardenCTX = new (function(){
	this.ptab = [
				// buttons, pots
				[itemButton, pots[0]],
				[itemButton, pots[1]],
				[itemButton, pots[2]],
				[itemButton, pots[3]],
				[itemButton, pots[4]],
				[itemButton, pots[5]],
				[itemButton, pots[6]]];
	this.pId = [0,1];
	this.pMax = [6,1];

	this.X = 0; //X&Y position
	this.Y = 0;
	
	// --- methods ---
	this.setPosition = function(){
		this.X = (this.ptab[this.pId[0]][this.pId[1]]).position[0];
		this.Y = (this.ptab[this.pId[0]][this.pId[1]]).position[1];
	}
})();


var itemsMenuCTX = new (function(){
	this.ptab = [
				// colonne 1
				[items[0],items[1],items[2],items[3]],
				// colonne 2
				[items[4],items[5],items[6],items[7]],
				// colonne 3
				[items[8],items[9],items[10],items[11]],
				// colonne 4
				[items[12],items[13],items[14],items[15]],
				// colonne 5
				[items[16],items[17],items[18],items[20]]];
	this.pId = [0,0];
	this.pMax = [4,3];

	this.X = 0; //X&Y position
	this.Y = 0;
	
	// --- methods ---
	this.setPosition = function(){
		this.X = this.ptab[this.pId[0]][this.pId[1]].position[0];
		this.Y = this.ptab[this.pId[0]][this.pId[1]].position[1];
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
			if(curItemId == 100)
				ctx.drawImage(this.img, 
							0, 0, this.width, this.height,
							this.context.X, this.context.Y - this.offset, 
							this.width, this.height);
			else {
				ctx.drawImage(items[curItemId].img, 
							0, 0, items[curItemId].width, items[curItemId].height,
							this.context.X, this.context.Y - items[curItemId].offset, 
							items[curItemId].width, items[curItemId].height);
			}
	//cutting source image and pasting it into destination one, drawImage(Image Object, source X, source Y, source Width, source Height, destination X (X position), destination Y (Y position), Destination width, Destination height)
		} catch (e) {
	//sometimes, if character's image is too big and will not load until the drawing of the first frame, Javascript will throws error and stop executing everything. To avoid this we have to catch an error and retry painting in another frame. It is invisible for the user with 50 frames per second.
		}
	}
})();
// ==========
cursor.context.setPosition;




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
		if(cursor.context == itemsMenuCTX) { // in the item panel
			// calculation of the desired id based on the position of the cursor
			curItemId = cursor.context.pMax[0] * cursor.context.pId[1]
						 + cursor.context.pId[0];
			cursor.context = gardenCTX;
			cursor.context.pId = [0,1];
		}
		else if(cursor.context == gardenCTX && cursor.context.pId[1] == 0) { // on the button
			cursor.context = itemsMenuCTX;
		}
		//else if(cursor.context == gardenCTX && cursor.context.pId[1] == 1 && curItemId == 100) { 
		//																	// on a pot without an item
		//	cursor.context = itemsMenuCTX;
		//}
		else if(cursor.context == gardenCTX && cursor.context.pId[1] == 1 && curItemId != 100) { 
																			// on a pot with an item
			cursor.context.ptab[cursor.context.pId[0]][cursor.context.pId[1]].setCrop(curItemId);	
			cursor.context.ptab[cursor.context.pId[0]][cursor.context.pId[1]].setCrop2(
						new Crop(cursor.context.ptab[cursor.context.pId[0]][cursor.context.pId[1]], 
						items[curItemId]));	
			cursor.context.ptab[cursor.context.pId[0]][cursor.context.pId[1]].crop2.sprout();
																			// Plant!
			curItemId = 100;	// deselect current item
		}
	break;
	case 188: // ,
		if(cursor.context == itemsMenuCTX) { // in the item panel
			// calculation of the desired id based on the position of the cursor
			curItemId = cursor.context.pMax[0] * cursor.context.pId[1]
						 + cursor.context.pId[0];
			cursor.context = gardenCTX;
			cursor.context.pId = [0,1];
		}
		else if(cursor.context == gardenCTX && cursor.context.pId[1] == 0) { // on the button
			cursor.context = itemsMenuCTX;
		}
		else if(cursor.context == gardenCTX && cursor.context.pId[1] == 1 && curItemId != 100) { 
																			// on a pot with an item
			cursor.context.ptab[cursor.context.pId[0]][cursor.context.pId[1]].setCrop(curItemId);	// Plant!
			curItemId = 100;	// deselect current item
		}
	break;

	// --- B ---
	case 110: // numpad .
		if(curItemId != 100) {
			curItemId = 100;	// deselect current item
		}
		else if(cursor.context == itemsMenuCTX) {
			cursor.context = gardenCTX;	// exit item menu
		}
	break;
	case 190: // period .
		if(curItemId != 100) {
			curItemId = 100;	// deselect current item
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
var drawPOTS = function(){
	var i;
	for(i=0; i<pots.length; ++i) {
		pots[i].drawSign();
	}
}
var drawPLANTS = function(){
	var i;
	for(i=0; i<pots.length; ++i) {
		if(pots[i].crop != 100) {
			pots[i].crop2.draw();
		}
	}
}
// ==========




// === Main loop ===
var GameLoop = function(){
	// scenery
	drawBG();
	drawPOTS();
	drawPLANTS();
	// overlay
	if(cursor.context == itemsMenuCTX) {
		drawMENU();
	}
	cursor.context.setPosition();
    cursor.draw();
	gLoop = setTimeout(GameLoop, 100/50);
}
GameLoop();
// ==========
