import React from 'react';
import ReactDOM from 'react-dom';
import Game from './game.js'

import { createStore } from "redux";
import { Provider } from "react-redux";
import { Reducer } from "./reducers.js";

ReactDOM.render(
    <Provider store={createStore(Reducer) }>
        <Game />
    </Provider>,
    document.querySelector('.app')
);


