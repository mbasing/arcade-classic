let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;

let userInput = prompt("Enter number of tries: ");
let numberOfTries = parseInt(userInput);


let player1Score = 0;  
let player2Score = 0;

let showingWinScreen = false;

let paddle1Y = 250;
let paddle2Y = 250;
let PADDLE_THICKNESS = 10;
let PADDLE_HEIGHT = 100;

let calculateMousePos=(evt)=> {
	let rect = canvas.getBoundingClientRect();
	let root = document.documentElement;
	let mouseX = evt.clientX - rect.left - root.scrollLeft;
	let mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

let handleMouseClick=(evt)=> {
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

window.onload = ()=> {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	let framesPerSecond = 30;
	setInterval(()=> {
			moveEverything();
			drawEverything();	
		}, 1000/framesPerSecond);

	canvas.addEventListener('mousedown', handleMouseClick);

	canvas.addEventListener('mousemove',
		(evt)=> {
			let mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
		});
}

let ballReset=()=> {
	if(player1Score >= numberOfTries ||
		player2Score >= numberOfTries) {
		showingWinScreen = true;
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

let computerMovement=()=> {
	let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < ballY - 35) {
		paddle2Y = paddle2Y + 6;
	} else if(paddle2YCenter > ballY + 35) {
		paddle2Y = paddle2Y - 6;
	}
}

let moveEverything=()=> {
	if(showingWinScreen) {
		return;
	}

	computerMovement();

	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	
	if(ballX < 0) {
		if(ballY > paddle1Y &&
			ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			let deltaY = ballY
					-(paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score++; 

			ballReset();
		}
	}
	if(ballX > canvas.width) {
		if(ballY > paddle2Y &&
			ballY < paddle2Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			let deltaY = ballY
					-(paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++; 
			ballReset();	
		}
	}
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}

let drawNet=()=> {
	for(let i=0;i<canvas.height;i+=40) {
		colorRect(canvas.width/2-1,i,2,20,'white');
	}
}

let playerOneProgressBar=()=> {
		colorRect(100, 550, 2, 20, "gold");
		colorRect(300, 550, 2, 20, "gold");
		for(let i=550;i<570;i+=18) {
			if(i>551 && i <569){
				colorRect(100, i, 200, 2, "gold");
				continue;
			}
			colorRect(100, i, 200, 2, "gold");
		}
		colorRect(100, 550, player1Score*(200/numberOfTries), 20, "gold");
	}
    
	let playerTwoProgressBar=()=> {
		colorRect(500, 550, 2, 20, "blue");
		colorRect(700, 550, 2, 20, "blue");
		for(let i=550;i<570;i+=18) {
			if(i>551 && i <569){
				colorRect(500, i, 200, 2, "blue");
				continue;
			}
			colorRect(500, i, 200, 2, "blue");
		}
		colorRect(500, 550, player2Score*(200/numberOfTries), 20, "blue");
	}

let drawEverything=()=> {
	colorRect(0,0,canvas.width,canvas.height,'black');

	if(showingWinScreen) {
		canvasContext.fillStyle = 'white';

		if(player1Score >= numberOfTries) {
			canvasContext.fillText("Left Player Won", 350, 200);
		} else if(player2Score >= numberOfTries) {
			canvasContext.fillText("Right Player Won", 350, 200);
		}
		canvasContext.fillText("click to continue", 350, 500);
		return;
	}

	drawNet();

	playerOneProgressBar();
	playerTwoProgressBar();

	// this is left player paddle
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

	// this is right computer paddle
	colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

	// next line draws the ball
	colorCircle(ballX, ballY, 10, 'white');

	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width-100, 100);
}

let colorCircle=(centerX, centerY, radius, drawColor)=> {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true);
	canvasContext.fill();
}

let colorRect=(leftX,topY, width,height, drawColor)=> {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
}

