import React from 'react';
import ReactDOM from 'react-dom';
import Game from './game.js'

import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { Provider } from "react-redux";
import rootReducer from "./reducers.js";

ReactDOM.render(
    <Provider store={createStore( rootReducer, applyMiddleware(thunk) )}>
        <Game />
    </Provider>,
    document.querySelector('.app')
);


