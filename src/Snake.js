import React, { useRef, useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import './Snake.css';

const DB_INSTANCE = axios.create({
	baseURL: 'http://localhost:3001',
	timeout: 1000,
	headers: {		
	}
});

const GAME_WIDTH = 16;
const TICK_INTERVAL = 100;
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
	} while (snakePositions.findIndex(positionComparator(position)) !== -1 || applePositions.findIndex(positionComparator(position)) !== -1);
	
	return position;
}

const getCellColour = (snakePositions, applePositions, isFinished, coords) => {
	if (isFinished && positionComparator(coords)(snakePositions[0])){
		return COLOUR_MAP['Hit'];			
	}
	else if (snakePositions.some(positionComparator(coords))) {					
		return COLOUR_MAP['Snake'];
	}
	else if (applePositions.some(positionComparator(coords))){
		return COLOUR_MAP['Apple'];
	}
	else {			
		return COLOUR_MAP['Empty'];		
	}
}

const initialState = () => ({
    snakePositions: [{x: Math.floor(GAME_WIDTH/2), y: Math.floor(GAME_WIDTH/2)}],
    snakeDirection: 'North',
	applePositions: [generateApple([{x: Math.floor(GAME_WIDTH/2), y: Math.floor(GAME_WIDTH/2)}], [])],
	snakeEating: false,
	isStarted: false,
    isFinished: false
});

const reducer = (state, intent) => {
	// console.log(`Reducer called with state: ${JSON.stringify(state)}`);
	if ((!state.isStarted || state.isFinished) && intent.type !== 'gameStart')
		return state;

	switch (intent.type) {
		case 'direction': {						
			return {
				...state,
				snakeDirection: intent.data
			}
		}
		case 'gameStart': {			
			return {
				...(initialState()), 
				isStarted: true
			}
		}
		case 'gameEnd': {
			return {
				...state,
				isFinished: true				
			}
		}
		case 'tick': {	
			//Apparently this is what you have to do if you have an array of objects and want to copy by value
			let currentSnakePositions = JSON.parse(JSON.stringify(state.snakePositions));						
			currentSnakePositions = updateSnakePositions(currentSnakePositions, state.snakeDirection);
			let currentApplePositions = JSON.parse(JSON.stringify(state.applePositions));
			let eating = false;				

			if (state.snakeEating){
				//Add new snake tile to the end of the array by double extending the head the tick after eating
				currentSnakePositions.unshift(MOVEMENT_MAPPING[state.snakeDirection](currentSnakePositions[0]));
			}

			//Check for apples
			state.applePositions.forEach((elem) => {
				if (positionComparator(elem)(currentSnakePositions[0])){
					eating = true;
					currentApplePositions.splice(currentApplePositions.findIndex(positionComparator(elem)), 1);
					//Get a new apple
					currentApplePositions.push(generateApple(currentSnakePositions, currentApplePositions));		
				}
			});

			//Check for walls
			if (currentSnakePositions[0].x >= GAME_WIDTH || currentSnakePositions[0].x < 0 || 
				currentSnakePositions[0].y >= GAME_WIDTH || currentSnakePositions[0].y < 0 ) {					
				return {...state, isFinished: true}
			}
			
			//Check if eating self
			if (currentSnakePositions.slice(1).some(positionComparator(currentSnakePositions[0]))){
				console.log('Snake ate his tale');
				return {...state, isFinished: true}
			}

			
			return {
				...state,
				snakePositions: currentSnakePositions, 
				applePositions: currentApplePositions,
				snakeEating: eating,
				isFinished: false
			}			
		}
		default: {
			console.log('Reducer received unmapped intent');
			return state;
		}
	}
}


function Snake() {	
	//Setup reducer function to alter state via intents
	//Intents have a type, in accordance with the format used in the React docs
	const [state, dispatch] = useReducer(reducer, initialState());	
	
	let latchedKeys = [];
	
	//The keypress handler will dispatch direction change events to the reducer function
	const keypressHandler = (event) => {
		if (event.key === 'r') {			
			dispatch({type:'gameStart'});
		}
		else if (Object.keys(INPUT_KEYS).indexOf(event.key) !== -1 && latchedKeys.indexOf(event.key) === -1){
		 	latchedKeys.push(event.key);		
			dispatch({type:'direction', data: INPUT_KEYS[event.key]});
		}
	}

	const keyupHandler = (event) => {
		//Unlatch the key
		latchedKeys.splice(latchedKeys.indexOf(event.key), 1);
	}

	//On component mount we want to add a listener for a WASD inputs (dependency list is empty)
	useEffect(() => {
		//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
		//Note that triggering events on keydown feels more responsive to me but leads to dispactch 
		//calls being spammed hence causing lag if user holds down a direction, fixed using a 'latched keys' array
		window.addEventListener('keydown', keypressHandler);
		window.addEventListener('keyup', keyupHandler);
		//Remember the useEffect hook returns a function to be run when the component unmounts
		return () => {
			window.removeEventListener('keydown', keypressHandler);
			window.removeEventListener('keyup', keypressHandler);
		}
	});

	//Another useEffect hook for the setInterval call that defines the framerate and drives the whole game
	useEffect(() => {
		const intervalID = setInterval(() => {			
			dispatch({type: 'tick'});			
		}, TICK_INTERVAL);
		return () => clearInterval(intervalID);
	}, []);
	
	return (
		<div className="SiteContainer">
			<Header />			
			<Game snakePositions={state.snakePositions} applePositions={state.applePositions} isFinished={state.isFinished} showOverlay={!state.isStarted}/>
			<ScoreForm show={state.isFinished} snakeLength={state.snakePositions.length}/>
			<Scoreboard />
			<Footer />
		</div>
	);
}

function Header() {
  	return <h1 className="Heading">React Snake</h1>; 
}

function GameOverlay({ show }) {	
	return (show) ? <div className="GameOverlay">
		Use w, a, s and d to control the snake. <br/>
		Press r to start and reload at any time!
	</div> : null
}

function Game({ snakePositions, applePositions, isFinished, showOverlay }) {
	return <div className="GameContainer">
		<GameOverlay show={showOverlay}/>
		<div className="Game">
			{
			widthArray.map((item, i) => <Row snakePositions={snakePositions} applePositions={applePositions} isFinished={isFinished} rowNumber={i} key={i}/>)
			}
		</div>
	</div>; 
}

function Row({ snakePositions, applePositions, isFinished, rowNumber }) {
	return <div className="Row" >
		{
		widthArray.map((item, i) => <Cell snakePositions={snakePositions} applePositions={applePositions} isFinished={isFinished} coords={{x: i, y: rowNumber}} key={i}/>)
		}
	</div>;
}

function Cell({ snakePositions, applePositions, isFinished, coords }) {	
	const cellRef = useRef(null);
	
	if (cellRef.current){		
		if (isFinished && positionComparator(coords)(snakePositions[0])){
			cellRef.current.style.backgroundColor = COLOUR_MAP['Hit'];			
		}
		else if (snakePositions.some(positionComparator(coords))) {					
			cellRef.current.style.backgroundColor = COLOUR_MAP['Snake'];
		}
		else if (applePositions.some(positionComparator(coords))){
			cellRef.current.style.backgroundColor = COLOUR_MAP['Apple'];
		}
		else {			
			cellRef.current.style.backgroundColor = COLOUR_MAP['Empty'];		
		}
	} 

	return <div ref={cellRef} className="Cell" style={{backgroundColor: getCellColour(snakePositions, applePositions, isFinished, coords)}}></div>;
}

function ScoreForm({ show, snakeLength, username }){
	const formSubmitHandler = (event) => {
		event.preventDefault();
		console.log(event);
		DB_INSTANCE.post('/scores', {
			id: parseInt(Math.random()*100),
			name: username,
			score: snakeLength
		})
		.then((response) => {						
			console.log(`Posted form data, got response: ${JSON.stringify(response)}`);
		})
		.catch((error) => {
			console.error(error);
		});
	}

	return (show) ? <form className="ScoreForm" onSubmit={formSubmitHandler}>
		<input type="text" placeholder="Player Name" name="playerName" />
		<input type="submit" />
	</form> : null;
}

function Scoreboard(){
	const [scores, setScores] = useState([]);
	useEffect(() => {		
		DB_INSTANCE.get('/scores')
		.then((response) => {						
			response.data.sort((a, b) => b.score - a.score);
			setScores(response.data);
		})
		.catch((error) => {
			console.error(error);
		});
	}, []);
	 	
	return <ul className="Scoreboard">
		{(scores.length > 0) ? scores.map((item, i) => <li key={i}>{item.name}: {item.score}</li>) : <li>No scores recorded yet!</li>}
	</ul>
}

function Footer() {
  	return <footer className="Footer">
		  <div className="FooterElement">By Finnlay Ernst</div>		  
		  <div className="FooterElement">finnlay.ernst@gmail.com</div>		   
	</footer>; 
}

export default Snake;