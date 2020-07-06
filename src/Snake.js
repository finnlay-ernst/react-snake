import React, { useRef, useReducer, useEffect } from 'react';
import './Snake.css';

const GAME_WIDTH = 8;

const INPUT_KEYS = {
	w: 'North',
	d: 'East',
	s: 'South',
	a: 'West'
};

let widthArray = [];
for (let i = 0; i<GAME_WIDTH; i++)
	widthArray.push(i);  

const updateSnakePositions = (snakePositions, snakeDirection) => {
	//TODO
	//Snake head is stored at the first index
	return snakePositions;
}

const generateApple = () => {
	//TODO
	return {x: 0, y: 0};
}

const initialState = {
    snakePositions: [{x: Math.floor(GAME_WIDTH/2), y: Math.floor(GAME_WIDTH/2)}],
    snakeDirection: 'North',
    applePositions: [],
    isFinished: false
};

const reducer = (currentState, intent) => {
	switch (intent.type) {
		case 'direction': {
			return {
				...currentState,
				snakeDirection: intent.data
			};
		}
		case 'appleSpawned': {	
			let currentApplePositions = currentState.applePositions;
			//Push the new apple position onto the array
			currentApplePositions.push(intent.data);						
			return {
				...currentState,
				applePositions: currentApplePositions
			};
		}
		case 'gameStart': {			
			return initialState;
		}
		case 'gameEnd': {
			return {
				...currentState,
				isFinished: true				
			};
		}
		case 'appleEaten': {
			let currentSnakePositions = currentState.snakePositions;
			//Add new snake tile to the end of the array
			currentSnakePositions.push(intent.data);			
			return {
				...currentState,
				snakePositions: currentSnakePositions
			};
		}
		case 'tick': {
			//TODO
			let currentSnakePositions = updateSnakePositions(currentState.snakePositions, currentState.snakeDirection);
			return {
				...currentState,
				snakePositions: currentSnakePositions
			};
		}
		default: {
			console.log('Reducer received unmapped intent');
			return currentState;
		}
	}
}


function Snake() {
	//Setup reducer function to alter state via intents
	//Intents have a type, in accordance with the format used in the React docs
	const [state, dispatch] = useReducer(reducer, initialState);
	
	//The keypress handler will dispatch direction change events to the reducer function
	const keypressHandler = (event) => {
		 console.log(event.key);
		 if (Object.keys(INPUT_KEYS).indexOf(event.key) !== -1)
		 	dispatch({type:'direction', data: INPUT_KEYS[event.key]});
	}

	//On component mount we want to add a listener for a WASD inputs (dependency list is empty)
	useEffect(() => {
		//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
		console.log("Running useEffect");
		window.addEventListener('keydown', keypressHandler);
		//Remember the useEffect hook returns a function to be run when the component unmounts
		return () => window.removeEventListener('keydown', keypressHandler);
	}, []);

	return (
		<div className="SiteContainer">
		<Header />
		<Game />
		<Footer />
		</div>
	);
}

function Header() {
  	return <h1 className="Heading">React Snake</h1>; 
}

function Game() {
	return <div className="GameContainer">
		{
		widthArray.map((item, i) => <Row rowNumber={i} key={i}/>)
		}
	</div>; 
}
function Row({ rowNumber }) {
	return <div className="Row" >
		{
		widthArray.map((item, i) => <Cell coords={{x: i, y: rowNumber}} key={i}/>)
		}
	</div>;
}
function Cell({ coords }) {
	let {x, y} = coords;
	const cellRef = useRef(null);
	//   if (state.snakePositions.indexOf({x,y}) !== -1) {
	//     console.log(`Position ${x}, ${y} is part of the snake`);
	//     cellRef.current.style = {backgroundColor: 'black'};
	//   }
	// if (state.applePositions.findIndex({x, y}) !== -1) 
	//   setColor('green');
	return <div ref={cellRef} className="Cell" style={{backgroundColor: `azure`}}></div>;
}

function Footer() {
  	return <footer className="Footer">By Finnlay Ernst | finnlay.ernst@gmail.com</footer>; 
}

export default Snake;
