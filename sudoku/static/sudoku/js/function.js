var currentPostion;
var originalSudoku;
var modifiedSudoku;

var blocks = createArray(9,9);
var rows = createArray(9,9);
var columns = createArray(9,9);

var invalidPositions = createArray(81);

String.prototype.setCharAt = function(idx, chr) {
	if(idx > this.length - 1){
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
	$("#generate").click(function() {
		var input = parseInt($("#hardInput").val());
		if(isNaN(input) || input <= 0 || input > 20) {
			alert("invalid input");
			return;
		}
		$.get("./puzzle/" + input,function(puzzle) {
			originalSudoku = puzzle;
			modifiedSudoku = new String(puzzle);
			for(i = 0; i < 9; i++) {
				for(j = 0; j < 9; j++) {
					var number = puzzle.charAt(i * 9 + j);
					rows[i][j] = number;
					columns[j][i] = number;
					blocks[parseInt(i / 3) * 3 + parseInt(j / 3)][i % 3 * 3 + j % 3] = number;
				}
			}
			drawMap(context, originalSudoku);
		});
	});

	$('#myCanvas').click(function(evt) {
		var mousePos = getMousePos(canvas, evt);
		highlightPositon(context, parsePostion(mousePos.x, mousePos.y));
	});

	$('#solve').click(function() {
		$.get("./solve/" + modifiedSudoku,function(response) {
			alert(response);
		})
	});

	$(document).keypress(function(evt) {
		if(currentPostion != null && originalSudoku.charAt(currentPostion) == '.') {
			var inputNumber = String.fromCharCode(evt.charCode);
			if(!isNaN(inputNumber) && parseInt(inputNumber) >= 1 && parseInt(inputNumber) <= 9) {
				var coordinate = getCoordinateByPositon(currentPostion);

				var rowPosition = $.inArray(inputNumber, rows[coordinate.row]);
				var columnPosition = $.inArray(inputNumber, columns[coordinate.column]);
				var blockPosition = $.inArray(inputNumber, blocks[parseInt(coordinate.row / 3) * 3 + parseInt(coordinate.column / 3)]);
				var textColor = "#FFFFFF";
				if(rowPosition != -1 || columnPosition != -1 || blockPosition != -1) {
					// invalidPositions[currentPostion] = -1;
				}
				if(rowPosition != -1) {
					// invalidPositions[coordinate.row * 9 + rowPosition] = -1;
					textColor = "#FF0000";
				} 
				if(columnPosition != -1) {
					// invalidPositions[columnPosition * 9 + coordinate.column] = -1;
					textColor = "#FF0000";
				} 
				
				if(blockPosition != -1) {
					// invalidPositions[invalidPositions.length] = 0;
					textColor = "#FF0000";
				}

				modifiedSudoku = modifiedSudoku.setCharAt(currentPostion, inputNumber);
				drawMap(context, modifiedSudoku, inputNumber);
				// drawBackground(context, currentPostion, "#FFFFCC");
				// drawNumber(context, currentPostion, inputNumber, textColor);
			}
		}
	});
});

function drawMap(context, sudoku, highlightNumber) {
	for(i = 0; i < 81; i++) {
		var number = sudoku.charAt(i);
		var backgroundColor = typeof highlightNumber !== 'undefined' && highlightNumber != "." &&
		    highlightNumber == number ? "#FFFFCC" : "#ffffff";
		var textColor = invalidPositions[i] == -1 ? "#FF0000" : number == originalSudoku.charAt(i) ? "#0000CC" : "#000000";
		drawBackground(context, i, backgroundColor);
		drawNumber(context, i, number, textColor);
	}
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function getTextColorByPositon(position) {
	return originalSudoku.charAt(currentPostion) == modifiedSudoku.charAt(currentPostion) ?	"#0000CC" : "#000000";
}

function highlightPositon(context, position) {
	currentPostion = position;

	var selectedNumber = modifiedSudoku.charAt(position);
	drawMap(context, modifiedSudoku, selectedNumber);
	drawHighlightNumber(context, position, selectedNumber);
}

function drawHighlightNumber(context, position, number) {
	drawBackground(context, position,"#FFFFCC");
	drawNumber(context, position, number,getTextColorByPositon(position));
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
