import React from 'react';
import './Snake.css';

const gameWidth =8;

let widthArray = [];
for (let i = 0; i<gameWidth; i++)
  widthArray.push(i);  

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
      widthArray.map((item, i) => <Row width={gameWidth}/>)
    }
  </div>; 
}
function Row({ width }){
  return <div className="Row" >
    {
      widthArray.map((item, i) => <div className="Cell" key={i}></div>)
    }
  </div>;
}

function Footer() {
  return <footer className="Footer">By Finnlay Ernst | finnlay.ernst@gmail.com</footer>; 
}

export default Snake;
