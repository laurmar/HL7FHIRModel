import React from 'react';
import ReactDOM from 'react-dom';
import MainComponent from './mainComponent'


// Here is where the application is actually added to the DOM. 
// Note that MainComponent is the component parent of all the other components.
ReactDOM.render(
<MainComponent/>
, document.getElementById('root'));



