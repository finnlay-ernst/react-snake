import React, { useRef, useReducer, useEffect } from 'react';
import './Snake.css';

const GAME_WIDTH = 12;
const TICK_INTERVAL = 5000;
const INPUT_KEYS = {
	w: 'North',
	d: 'East',
	s: 'South',
	a: 'West'
}
const COLOUR_MAP = {
	Snake: 'black', 
	Apple: 'green',
	Empty: 'azure',
	Hit: 'red'
}

const MOVEMENT_MAPPING = {
	North: ({ x, y }) => ({x: x, y: y-1}),
	East: ({ x, y }) => ({x: x+1, y: y}),
	South: ({ x, y }) => ({x: x, y: y+1}),
	West: ({ x, y }) => ({x: x-1, y: y})
}

let widthArray = [];
for (let i = 0; i<GAME_WIDTH; i++)
	widthArray.push(i);  

//Returns a function that can be used to check if the given position posA is in an array
const positionComparator = (posA) => {
	return (posB) => posA.x === posB.x && posA.y === posB.y;
}

const updateSnakePositions = (snakePositions, snakeDirection) => {
	const newHead = MOVEMENT_MAPPING[snakeDirection](snakePositions[0]);
	//Shift on a new position for the snake head
	snakePositions.unshift(newHead);
	//Pop off the last element (the last tail square)
	snakePositions.pop();
	return snakePositions;
}

const generateApple = (snakePositions, applePositions) => {
	let position;
	//Keep generating apples until we get one thats in an empty spot
	do {
		position = {x: Math.floor(Math.random() * GAME_WIDTH), y: Math.floor(Math.random() * GAME_WIDTH)};
	} while (snakePositions.indexOf(position) !== -1 || applePositions.indexOf(position) !== -1);
	// console.log(`Apple Position: ${position.x}, ${position.y}`);
	return position;
}

const initialState = {
    snakePositions: [{x: Math.floor(GAME_WIDTH/2), y: Math.floor(GAME_WIDTH/2)}],
    snakeDirection: 'North',
    applePositions: [generateApple([{x: Math.floor(GAME_WIDTH/2), y: Math.floor(GAME_WIDTH/2)}], [])],
    isFinished: false
};

const reducer = (currentState, intent) => {
	switch (intent.type) {
		case 'direction': {						
			return {
				...currentState,
				snakeDirection: intent.data
			}
		}
		case 'appleSpawned': {	
			let currentApplePositions = currentState.applePositions;
			//Push the new apple position onto the array
			currentApplePositions.push(intent.data);						
			return {
				...currentState,
				applePositions: currentApplePositions
			}
		}
		case 'gameStart': {			
			return initialState;
		}
		case 'gameEnd': {
			return {
				...currentState,
				isFinished: true				
			}
		}
		case 'appleEaten': {
			let currentSnakePositions = currentState.snakePositions;
			//Add new snake tile to the end of the array
			currentSnakePositions.push(intent.data);			
			return {
				...currentState,
				snakePositions: currentSnakePositions
			}
		}
		case 'tick': {	
			//console.log(currentState.snakePositions[0]);			
			return {
				...currentState,
				snakePositions: updateSnakePositions(currentState.snakePositions, currentState.snakeDirection)
			}
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
		if (Object.keys(INPUT_KEYS).indexOf(event.key) !== -1)
			dispatch({type:'direction', data: INPUT_KEYS[event.key]});
	}

	//On component mount we want to add a listener for a WASD inputs (dependency list is empty)
	useEffect(() => {
		//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
		window.addEventListener('keydown', keypressHandler);
		//Remember the useEffect hook returns a function to be run when the component unmounts
		return () => window.removeEventListener('keydown', keypressHandler);
	}, []);

	//Another useEffect hook for the setInterval call that defines the framerate and drives the whole game
	useEffect(() => {
		const intervalID = setInterval(() => {
			console.log('Interval function triggered');
			dispatch({type: 'tick'});
		}, TICK_INTERVAL);
		return () => clearInterval(intervalID);
	}, []);

	state.applePositions.forEach((elem) => {
		if (positionComparator(elem)(state.snakePositions[0])){
			dispatch ({type: 'appleEaten', data: elem});
			return;
		}
	});

	return (
		<div className="SiteContainer">
			<Header />
			<Game snakePositions={state.snakePositions} applePositions={state.applePositions}/>
			<Footer />
		</div>
	);
}

function Header() {
  	return <h1 className="Heading">React Snake</h1>; 
}

function Game({ snakePositions, applePositions }) {
	return <div className="GameContainer">
		{
		widthArray.map((item, i) => <Row snakePositions={snakePositions} applePositions={applePositions} rowNumber={i} key={i}/>)
		}
	</div>; 
}
function Row({ snakePositions, applePositions, rowNumber }) {
	return <div className="Row" >
		{
		widthArray.map((item, i) => <Cell snakePositions={snakePositions} applePositions={applePositions} coords={{x: i, y: rowNumber}} key={i}/>)
		}
	</div>;
}

function Cell({ snakePositions, applePositions, coords }) {	
	const { x, y } = coords;
	const cellRef = useRef(null);
	

	if (cellRef.current){

		if (snakePositions.some(positionComparator(coords))) {		
			cellRef.current.style.backgroundColor = COLOUR_MAP['Snake'];
		}
		else if (applePositions.some(positionComparator(coords))){
			cellRef.current.style.backgroundColor = COLOUR_MAP['Apple'];
		}
		else {			
			cellRef.current.style.backgroundColor = COLOUR_MAP['Empty'];		
		}
	} 

	return <div ref={cellRef} className="Cell" style={{backgroundColor: COLOUR_MAP['Empty']}}></div>;
}

function Footer() {
  	return <footer className="Footer">
		  <div className="FooterElement">By Finnlay Ernst</div>		  
		  <div className="FooterElement">finnlay.ernst@gmail.com</div>		   
	</footer>; 
}

export default Snake;
