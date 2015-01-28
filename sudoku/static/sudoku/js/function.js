var currentPostion;
var sudokuData;
var modifiedSudoku;

String.prototype.setCharAt = function(idx, chr) {
	if(idx> this.length - 1){
		return this.toString();
	} else {
		return this.substr(0, idx) + chr + this.substr(idx + 1);
	}
};

$(document).ready(function() {
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext('2d');
	context.translate(0.5,0.5);

	for(i = 0; i <= 9; i++) {
		if(i % 3 == 0) {
			context.lineWidth = 2;
		} else {
			context.lineWidth = 1;
		}
		drawLine(context, 0, i * 69, 621, i * 69);
		drawLine(context, i * 69, 0, i * 69, 621);
	}

	$.get("./puzzle/",function(puzzle) {
		sudokuData = puzzle;
		modifiedSudoku = new String(puzzle);
		for(i = 0; i < 81; i++) {
			var number = puzzle.charAt(i)
			drawNumber(context, i, number, "#0000CC");
		}
	});

	canvas.addEventListener('click', function(evt) {
		var mousePos = getMousePos(canvas, evt);
		highlightPositon(context, parsePostion(mousePos.x, mousePos.y));
	}, false);

	document.addEventListener('keypress' ,function(evt) {
		if(currentPostion != null && sudokuData.charAt(currentPostion) == '.') {
			var inputNumber = String.fromCharCode(evt.charCode);
			if(!isNaN(inputNumber) && parseInt(inputNumber) >= 1 && parseInt(inputNumber) <= 9) {
				modifiedSudoku = modifiedSudoku.setCharAt(currentPostion, inputNumber);
				drawBackground(context, currentPostion, "#FFFFCC");
				drawNumber(context, currentPostion, inputNumber);
			}
		}
	}, false);
});

function getTextColorByPositon(position) {
	return sudokuData.charAt(currentPostion) == modifiedSudoku.charAt(currentPostion) ?	"#0000CC" : "#000000";
}

function unHighlightPositon(context, position) {
	drawBackground(context, currentPostion, "#ffffff");
	drawNumber(context, currentPostion, 
		modifiedSudoku.charAt(currentPostion),
		getTextColorByPositon(position));
}

function highlightPositon(context, position) {
	if(currentPostion != null) {
		unHighlightPositon(context, position);
	}
	currentPostion = position;
	drawBackground(context, position,"#FFFFCC");
	drawNumber(context, position, 
		modifiedSudoku.charAt(position),
		getTextColorByPositon(position));
}

function parsePostion(x , y) {
	return parseInt(y / 69) * 9 + parseInt(x / 69);
}

function getCoordinateByPositon(position) {
	return {
		row: parseInt(position / 9),
		column: parseInt(position % 9)
	}
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function drawLine(context, startX, startY, endX, endY) {
	context.beginPath();
	context.fillStyle = "#000000";
	context.moveTo(startX, startY);
	context.lineTo(endX, endY);
	context.stroke();
}

function drawBackground(context, position, background) {
	var x = parseInt(position % 9) * 69;
	var y = parseInt(position / 9) * 69;
	context.fillStyle = background;
	context.fillRect(x + 2, y + 2, 65, 65);
}

function drawNumber(context, position, number, color) {
	if(number != '.') {
		color = typeof color !== 'undefined' ? color : "#000000";
		var x = parseInt(position % 9) * 69;
		var y = parseInt(position / 9) * 69;

		context.font = "45px Arial";
		context.textBaseline = 'top';

		context.fillStyle = color;
		context.fillText(number, x + 22, y + 10);
	}
}
