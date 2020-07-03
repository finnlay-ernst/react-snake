import React from 'react';
import './Snake.css';

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
  return <div className="GameContainer">Placeholder</div>; 
}
function Footer() {
  return <footer className="Footer">By Finnlay Ernst | finnlay.ernst@gmail.com</footer>; 
}

export default Snake;
