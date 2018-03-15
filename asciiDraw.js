let width;
let height;
let canvas = [];
let strokeChar = `/`;
let backgroundChar = ` `;


const init = () => {
	for (var i = 0; i < height; i++) {
		canvas.push([""]);
		for (var j = 0; j < width; j++) {
			canvas[i] += backgroundChar;
		}
	}
}

const getWindowDimensions = () => {
	let dimensions = [0,0];
	let w=window,
	d=document,
	e=d.documentElement,
	g=d.getElementsByTagName('body')[0];
	dimensions[0] = w.innerWidth||e.clientWidth||g.clientWidth;
	dimensions[1] = w.innerHeight||e.clientHeight||g.clientHeight;
	return dimensions;
}

let windowW = getWindowDimensions()[0];
let windiwH = getWindowDimensions()[1];

const size = (w,h) => {
	width = w;
	height = h;
	$("#asciiCanvas").css("width", (charD[0]*width)+5); //fix target
	$("#asciiCanvas").css("height", (charD[1]*height)+5);
}

const fullscreen = () => {
	size(Math.ceil(windowW/charD[0]),Math.ceil(windiwH/charD[1]));
}

const display = (target) => {
	var str = "";
	for (var i = 0; i < canvas.length; i++) {
		str+= canvas[i]+"<br>";
	}
	$(target).html(str);
}

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

function midpoint(a, b) {
    return Math.floor((a + b) / 2);
}

const normalize = (val, start1, stop1, start2, stop2) => {
	return Math.floor(((val-start1)/(stop1-start1))*(stop2-start2)+start2);
}

function drawMidpoints(p0, p1) {
    let middle = [midpoint(p0[0], p1[0]), midpoint(p0[1], p1[1])];
    point(middle[0],middle[1])
    if ((p0[0] !== middle[0] || p0[1] !== middle[1]) && (p1[0] !== middle[0] || p1[1] !== middle[1])) {
        drawMidpoints(p0, middle);
        drawMidpoints(middle, p1);
    }
}

const point = (xc,yc) => {
	let x = Math.floor(xc);
	let y = Math.floor(yc);

	if (x >= 0 && y >= 0 && x < width && y < height) {
		// canvas = canvas.replaceAt(getCoords(x,y), strokeChar);
		canvas[y] = canvas[y].replaceAt(x,strokeChar);
	}
}

const clearPoint = (xc,yc) => {
	canvas[yc] = canvas[yc].replaceAt(xc, backgroundChar);
}


const strokeEllipse = (x,y,w,h) => {
	let cx = x+w/2; // center
	let cy = y+h/2;
	let rx = w/2; // radius
	let ry = h/2;

	for (let i = 0; i < 360; i++) {
		let xx = Math.floor(cx + rx * Math.cos(i));
		let yy = Math.floor(cy + ry * Math.sin(i));
		
		point(xx,yy);
	}
	
}

const fillEllipse = (x,y,w,h) => { // fix, too expensive
	for (let i = 0; i < w; i++) {
		strokeEllipse(x+i/2,y,w-i,h);
	}
	for (var i = 0; i < h; i++) {
		strokeEllipse(x,y+i/2,w,h-i);
	}
}

const strokeRect = (x,y,w,h) => {
	for (let i = 0; i < w; i++) {
		point(x+i,y);
	}
	for (let i = 0; i < w; i++) {
		point(x+i,y-1+h);
	}
	for (let i = 0; i < h; i++) {
		point(x,y+i);
	}
	for (let i = 0; i < h; i++) {
		point(x+w-1,y+i);
	}
}

const fillRect = (x,y,w,h) => {
	for (let j = 0; j < h; j++) {
		for (let i = 0; i < w; i++) {
			point(x+i,y+j);
		}
	}	
}

const clearRect = (x,y,w,h) => {
	for (let j = 0; j < h; j++) {
		for (let i = 0; i < w; i++) {
			clearPoint(x+i,y+j);
		}
	}	
}

const tableCell = (x,y,w,h,cornerChar,horizontalChar,verticalChar, bgChar) => {
	let prevStroke = strokeChar;

	if (bgChar == null){} else {
		stroke(bgChar);
		fillRect(x,y,w,h);
	}

	
	stroke(horizontalChar);
	for (let i = 0; i < w; i++) {
		point(x+i,y);
	}
	for (let i = 0; i < w; i++) {
		point(x+i,y-1+h);
	}
	stroke(verticalChar);
	for (let i = 0; i < h; i++) {
		point(x,y+i);
	}
	for (let i = 0; i < h; i++) {
		point(x+w-1,y+i);
	}
	stroke(cornerChar);
	point(x,y);
	point(x+w-1,y);
	point(x+w-1,y+h-1);
	point(x,y+h-1);
	stroke(prevStroke);
}

const tableRow = (x,y,w,h,cells) => {
	let cellW = Math.floor(w/cells);
	for (var i = 0; i < cells; i++) {
		tableCell(x+(cellW*i),y,cellW+1,h,"+","-","|"," ");
	}
}

const line = (x1,y1,x2,y2) => {
	drawMidpoints([x1,y1], [x2, y2]);
}

let tempStoreInit = [];
let tempStore = tempStoreInit;

const beginShape = (x,y) => {
	tempStoreInit = [x,y];
	tempStore = [x,y];
}

const lineTo = (x,y) => {
	line(tempStore[0],tempStore[1],x,y);
	tempStore = [x,y];
}

const closeShape = () => {
	line(tempStoreInit[0], tempStoreInit[1], tempStore[0], tempStore[1]);
}

const text = (string,x,y,dir) => {
	let prevStroke = strokeChar;
	if (dir == null || dir == "horizontal"){
		for (let i = 0; i < string.length; i++) {
			stroke(string[i]);
			point(x+i,y);
		}
	} else if (dir == "vertical") {
		for (let i = 0; i < string.length; i++) {
			stroke(string[i]);
			point(x,y+i);
		}
	}
	stroke(prevStroke);
}

const stroke = (char) => {
	strokeChar = String(char);
}

const background = (char) => {
	backgroundChar = String(char);
}

const importAscii = (str,x,y,ignoreChar) => {
	let prevStroke = strokeChar;
	for (let j = 0; j < str.length; j++) {
		for (let i = 0; i < str[j].length; i++) {
			if (str[j][i] !== ignoreChar) {
				stroke(str[j][i])
				point(x+i,y+j);
			}
		}
	}
	stroke(prevStroke);	
}