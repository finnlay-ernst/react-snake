import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Snake from './Snake';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Snake />
  </React.StrictMode>,
  document.getElementById('root')
);
  
document.title = 'React Snake';
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
