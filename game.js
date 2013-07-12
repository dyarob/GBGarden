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



// === Images ===
var tinyfont = new Image();
tinyfont.src = "tinyfont_big.png";
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
function Item(position, image, imagesign, sprite, maxsize, dt, onestalk) {

	// --- attributes ---
	this.position = position;
	this.img = image;
	this.sign = imagesign;
	this.width = 32; //width of the single frame
	this.height = 32; //height of the single frame
	this.offset = 16;
	
	// - Growth attributes -
	this.maxSize = maxsize;
	this.stalkSPRT = sprite;
	this.steptime = dt;
	this.oneStalk = onestalk;
	
	// - inventory -
	this.quantity = 0;
	
	// --- methods ---
	this.sow = function() {	// semer
		// must make a small sprout appear
	}
	this.setQuantity = function(q) {
		this.quantity = q;
	}
	this.drawQuantity = function() {
	
		var i = 0;
		var q = this.quantity;
		var d;
		
		if(q == 0) {
			try {
				ctx.drawImage(tinyfont, 0, 0, 8, 8, this.position[0] +6, this.position[1] +38, 8, 8);
			} catch (e) {}
		}
		else {
			// get number of digits
			while(q != 0) {
				
				// get digit
				d = q % 10;
				
				// draw
				try {
					ctx.drawImage(tinyfont, d*8, 0, 8, 8, this.position[0]-i*8 +6, this.position[1] +38, 8, 8);
				} catch (e) {}
				
				// iterate
				q = ~~(q/10);
				++i;
			}
		}
	}
}

// seeds img
var imgi1 = new Image();
imgi1.src = "item1.png";
var imgi2 = new Image();
imgi2.src = "item2.png";
// signs
var sign1 = new Image();
sign1.src = "item1_sign.png";
var sign2 = new Image();
sign2.src = "item2_sign.png";
// sprites (let's assume it's always 16*16)
var sprt1 = new Image();
sprt1.src = "item1_stalk.png";
var sprt2 = new Image();
sprt2.src = "item2_stalk.png";

// items
var item1 = new Item([70,44],imgi1,sign1,sprt1, 5, 500, 0);
var item2 = new Item([118,44],imgi2,sign2,sprt2, 4, 5000, 1);

var items = [item1, new Item([70,92],imgi1,sprt1),
			new Item([70,140],imgi1,sprt1),new Item([70,188],imgi1,sprt1),
			
			item2,new Item([118,92],imgi1,sprt1),
			new Item([118,140],imgi1,sprt1),new Item([118,188],imgi1,sprt1),
			
			new Item([166,44],imgi1,sprt1),new Item([166,92],imgi1,sprt1),
			new Item([166,140],imgi1,sprt1),new Item([166,188],imgi1,sprt1),
			
			new Item([214,44],imgi1,sprt1),new Item([214,92],imgi1,sprt1),
			new Item([214,140],imgi1,sprt1),new Item([214,188],imgi1,sprt1),
			
			new Item([262,44],imgi1,sprt1),new Item([262,92],imgi1,sprt1),
			new Item([262,140],imgi1,sprt1),new Item([262,188],imgi1,sprt1)];
			
var curItemId = 100;	// 100 = no item selected
item1.setQuantity(3);
item2.setQuantity(1);
// ==========



// === POTS ===
// --- Constructor ---
function Pot(position, size, image) {

	// --- attributes ---
	this.position = position;
	this.size = size; // 1 = small (1 tile wide); 2 = medium (2t); 3 = big (3t)
	this.img = image;
	this.crop = 100;	// 100 = nothing
	this.crop2;	
	this.signPosition = [this.position[0] - 16, this.position[1] - 10];
	
	// --- methods ---
	this.setCrop = function(id) {
		this.crop = id;
	}
	this.setCrop2 = function(crop) {
		this.crop2 = crop;
	}
	
	this.draw = function() {
		if(this.crop != 100) {
			this.crop2.draw();
		}
		try {
			ctx.drawImage(this.img, 0, 0, 320, 288, 0, 0, 320, 288);
		} catch (e) {}
		if(this.crop != 100) {
			this.drawSign();
		}
	}
	
	this.drawSign = function() {
		try {
			ctx.drawImage(items[this.crop].sign, 
						0, 0, items[this.crop].width, items[this.crop].height,
						this.signPosition[0], this.signPosition[1] + items[this.crop].offset, 
						items[this.crop].width, items[this.crop].height);
		} catch (e) {}
	}
}

// img pots
var POT0img = new Image();
POT0img.src = "pot1.png";
var POT1img = new Image();
POT1img.src = "pot2.png";
var POT2img = new Image();
POT2img.src = "pot3.png";
var POT3img = new Image();
POT3img.src = "pot4.png";
var POT4img = new Image();
POT4img.src = "pot5.png";
var POT5img = new Image();
POT5img.src = "pot6.png";
var POT6img = new Image();
POT6img.src = "pot7.png";

var pots = [new Pot([25,190], 3, POT6img), new Pot([80,222], 1, POT2img),
			new Pot([130,212], 2, POT4img),new Pot([160, 242], 1, POT0img),
			new Pot([198, 242], 1, POT1img),new Pot([244, 224], 2, POT5img),
			new Pot([292, 210], 2, POT3img)]
// ==========



// === CROPS ===
// --- Constructor ---
function Crop(pot, item) {

	// --- Attributes ---
	this.pot = pot;	// pot of the plant (for position and pot size)
	this.item = item;	// from what seed is it (contain the growth algorithm and sprites etc)
	this.saveState = [];	// State save = array list of stalks
	
	// - Growth attributes -
	this.timer = 0;
	this.lastUpdate = Date.now();
	this.step = 0;
	this.maxstep = 16 + 8 * Math.pow(this.pot.size, 2);	// this.item.maxSize * this.pot.size doesn't work
	
	// --- Methods ---
	this.sprout = function() {	// must make a small sprout appear
		this.saveState.push(new Stalk([this.pot.position[0] + 2*(~~(Math.random()*9*this.pot.size -(9*this.pot.size)/2)), 
										this.pot.position[1] + 2*((~~(Math.random()*6))-1)],
									  this.item.stalkSPRT));
	}
	this.sproutAt = function(position) {	// must make a small sprout appear at a given position
		this.saveState.push(new Stalk( position,
									  this.item.stalkSPRT));
	}
	
	this.grow = function() {	// repeat until full growth (maxSize times)
		if(this.step < this.maxstep) {
			this.timer += (Date.now() - this.lastUpdate);	// timer increment
			this.lastUpdate = Date.now();
			
			if(this.timer >= this.item.steptime) {
				this.timer = 0;
				this.growOneStep();
			}
		}
	}
	
	this.growOneStep = function() {	// grow the plant by one step
		var l = this.saveState.length;
		if(this.item.oneStalk == 0) {	// plant with multiple stalks
			var x = this.pot.position[0] + 2*(~~(Math.random()*9*this.pot.size -(9*this.pot.size)/2));
			var i;
			var marker = 0;
			for(i=0; i<l; ++i) {
				if(this.saveState[i].position[0] == x) {	// there is already a stalk here
					if(this.saveState[i].size < this.item.maxSize) {
						this.saveState[i].growOneStep();	// grow it
						marker = 1;
					}
					break;
				}
			}
			if(marker == 0) {
				this.sproutAt([x, this.pot.position[1] + 2*((~~(Math.random()*6))-1)]);
			}
		}
		else if(this.item.oneStalk == 1) {	// only one stalk (type cactus)
			if(this.saveState[0].size < this.item.maxSize) {
				this.saveState[0].growOneStep();
			}
		}
		++this.step;
	}
	
	this.draw = function() {	// to draw BEFORE the pots (no risks of drawing above the pot)
		var i;
		for(i=0; i<this.saveState.length; ++i) {
			this.saveState[i].draw();
		}
	}
}

// --- Stalk ---
function Stalk(position, img) {	// to add later: sprite id for plants with more than just one sprite

	// --- Attributes ---
	this.position = [position[0]-4, position[1]];
	this.img = img;
	this.saveState = [this.position];	// State save = array list of posiions of plant segments
	this.size = 0;	// may be used to monitor max size of stalks
	
	// --- Methods ---
	this.growOneStep = function() {	// grow the plant by one step
		var l = this.saveState.length;
		this.saveState.push(
					[this.saveState[l-1][0] + 2*((~~(Math.random()*3))-1), 
					 this.saveState[l-1][1] -16 ]);
		++this.size;
	}
	
	this.draw = function() {
		var i;
		for(i=0; i<this.saveState.length; ++i) {
			try {
				ctx.drawImage(this.img, 
						0, 0, 16, 16,
						this.saveState[i][0], this.saveState[i][1], 
						16, 16);
			} catch (e) {}
		}
	}
}

// --- GROW ---
var grow = function() {
	var i;
	for(i=0; i<pots.length; ++i) {
		if(pots[i].crop2) {
			pots[i].crop2.grow();
		}
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
cursorimg = new Image();
cursorimg.src = "cursor.png";
scytheimg = new Image();
scytheimg.src = "scythe.png";
	
var cursor = new (function(){
	this.img = cursorimg;

	this.width = 16; //width of the single frame
	this.height = 16; //height of the single frame
	this.offset = 0;

	this.context = gardenCTX;
	this.scythemode = 0;

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
		Left();
    break;
    case 65: // a
		Left();
    break;

	// --- RIGHT ---
    case 39: // Right
		Right();
    break;
    case 68: // d
		Right();
    break;

	// --- UP ---
    case 38: // Up
		Up();
    break;
    case 87: // w
		Up();
    break;

	// --- DOWN ---
    case 40: // Down
		Down();
    break;
    case 83: // s
		Down();
    break;

	// --- A ---
	case 96: // numpad 0
		A();
	break;
	case 188: // ,
		A();
	break;

	// --- B ---
	case 110: // numpad .
		B();
	break;
	case 190: // period .
		B();
	break;
  }
  
	cursor.context.setPosition();
	
}, false);

// --- METHODS ---
var Left = function() {
	if(cursor.context.pId[0] > 0)
		--cursor.context.pId[0];
	else cursor.context.pId[0] = cursor.context.pMax[0];
}

var Right = function() {
	if(cursor.context.pId[0] < cursor.context.pMax[0])
		++cursor.context.pId[0];
	else cursor.context.pId[0] = 0;
}

var Up = function() {
	if(cursor.context.pId[1] > 0)
		--cursor.context.pId[1];
	else cursor.context.pId[1] = cursor.context.pMax[1];
}

var Down = function() {
	if(cursor.context.pId[1] < cursor.context.pMax[1])
		++cursor.context.pId[1];
	else cursor.context.pId[1] = 0;
}

var A = function() {
	if(cursor.context == itemsMenuCTX) { // in the item panel
		var id = cursor.context.pMax[0] * cursor.context.pId[0] + cursor.context.pId[1];
		if(items[id].quantity > 0) {
			// calculation of the desired id based on the position of the cursor
			curItemId = cursor.context.pMax[0] * cursor.context.pId[0] + cursor.context.pId[1];
			cursor.context = gardenCTX;
			cursor.context.pId = [0,1];
			--items[id].quantity;
		}
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
	else if(cursor.context == gardenCTX && cursor.context.pId[1] == 1 && cursor.scythemode == 1) { 
																		// on a pot in scythe mode
		cursor.context.ptab[cursor.context.pId[0]][cursor.context.pId[1]].crop2.item.quantity += 
					cursor.context.ptab[cursor.context.pId[0]][cursor.context.pId[1]].crop2.step;	
		cursor.context.ptab[cursor.context.pId[0]][cursor.context.pId[1]].setCrop(100);	
	}
}

var B = function() {
	if(curItemId != 100) {
		curItemId = 100;	// deselect current item
	}
	else if(cursor.context == itemsMenuCTX) {
		cursor.context = gardenCTX;	// exit item menu
	}
	else if(cursor.context == gardenCTX) {
		if(cursor.scythemode == 0) {	// go to scythe mode
			cursor.img = scytheimg;
			cursor.scythemode = 1;
		}
		else if(cursor.scythemode == 1) {
			cursor.img = cursorimg;
			cursor.scythemode = 0;
		}
	}
}
// ==========




// === drawing ===
var BGimg = new Image();
BGimg.src = "BG.png";
var drawBG = function(){
	try {
		ctx.drawImage(BGimg, 0, 0, 320, 288, 0, 0, 320, 288);
	} catch (e) {}
}

var MENUimg = new Image();
MENUimg.src = "MENUimg.png";
var drawMENU = function(){
	try {
		ctx.drawImage(MENUimg, 0, 0, 320, 288, 0, 0, 320, 288);
	} catch (e) {}
}

var BUTTONSimg = new Image();
BUTTONSimg.src = "BUTTONS.png";
var drawBUTTONS = function(){
	try {
		ctx.drawImage(BUTTONSimg, 0, 0, 320, 288, 0, 0, 320, 288);
	} catch (e) {}
}

var SCYTHEONimg = new Image();
SCYTHEONimg.src = "scytheon.png";
var SCYTHEOFFimg = new Image();
SCYTHEOFFimg.src = "scytheoff.png";
var drawSCYTHE = function(){
	if(cursor.scythemode == 0) {
		try {
			ctx.drawImage(SCYTHEONimg, 0, 0, 320, 288, 0, 0, 320, 288);
		} catch (e) {}
	}
	else if(cursor.scythemode == 1) {
		try {
			ctx.drawImage(SCYTHEOFFimg, 0, 0, 320, 288, 0, 0, 320, 288);
		} catch (e) {}
	}
}

//var POTSimg = new Image();
//POTSimg.src = "pots.png";

var drawPOTS = function(){
	// in the right order: background -> foreground
	pots[0].draw();
	pots[5].draw();
	pots[2].draw();
	pots[6].draw();
	pots[1].draw();
	pots[4].draw();
	pots[3].draw();
}
var drawPLANTS = function(){
	var i;
	for(i=0; i<pots.length; ++i) {
		if(pots[i].crop != 100) {
			pots[i].crop2.draw();
		}
	}
}

var drawQuantities = function(){
	var i;
	for(i=0; i<items.length; ++i) {
			items[i].drawQuantity();
	}
}
// ==========




// === Main loop ===
var GameLoop = function(){
	// processing
	grow();

	// scenery
	drawBG();
	drawPLANTS();
	drawPOTS();
	drawSCYTHE();
	drawBUTTONS();
	
	// overlay
	if(cursor.context == itemsMenuCTX) {
		drawMENU();
		drawQuantities();
	}
	cursor.context.setPosition();
    cursor.draw();
	gLoop = setTimeout(GameLoop, 100/50);
}
GameLoop();
// ==========
