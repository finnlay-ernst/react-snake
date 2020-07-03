import React, { useState } from 'react';
import './Snake.css';

const gameWidth = 8;

let widthArray = [];
for (let i = 0; i<gameWidth; i++)
  widthArray.push(i);  

let state = {
  snakePositions: [{x: 0, y: 0}],
  snakeDirection: 'North',
  applePositions: [],
  isFinished: false
};

let reducer = (currentState, intent) => {
  return currentState;
}


function Snake() {
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
  const [color, setColor] = useState('azure');
  if (state.snakePositions.indexOf({x,y}) !== -1) {
    console.log(`Position ${x}, ${y} is part of the snake`);
    setColor('black');
  }
  // if (state.applePositions.findIndex({x, y}) !== -1) 
  //   setColor('green');
  return <div className="Cell" style={{backgroundColor: `${color}`}}></div>;
}

function Footer() {
  return <footer className="Footer">By Finnlay Ernst | finnlay.ernst@gmail.com</footer>; 
}

export default Snake;
