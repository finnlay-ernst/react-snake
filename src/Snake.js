import React, { useRef, useReducer, useEffect } from 'react';
import './Snake.css';

const gameWidth = 8;

const inputKeys = {
  North: 'W',
  East: 'D',
  South: 'S',
  West: 'A'
};

let widthArray = [];
for (let i = 0; i<gameWidth; i++)
  widthArray.push(i);  

let initialState = {
    snakePositions: [{x: 0, y: 0}],
    snakeDirection: 'North',
    applePositions: [],
    isFinished: false
};

let reducer = (currentState, intent) => {
  return currentState;
}

let keypressHandler = (event) => {
 console.log(event);
}

function Snake() {
  //Setup reducer function to alter state via intents
  const [state, dispatch] = useReducer(reducer, initialState);

  //On component mount we want to add a listener for a WASD inputs (dependency list is empty)
  useEffect(() => {
    //https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    window.addEventListener('keypress', keypressHandler);
    //Remember the useEffect hook returns a function to be run when the component unmounts
    return () => {window.removeEventListener('keypress', keypressHandler);}
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
  if (state.snakePositions.indexOf({x,y}) !== -1) {
    console.log(`Position ${x}, ${y} is part of the snake`);
    cellRef.current.style = {backgroundColor: 'black'};
  }
  // if (state.applePositions.findIndex({x, y}) !== -1) 
  //   setColor('green');
  return <div ref={cellRef} className="Cell" style={{backgroundColor: `${color}`}}></div>;
}

function Footer() {
  return <footer className="Footer">By Finnlay Ernst | finnlay.ernst@gmail.com</footer>; 
}

export default Snake;
