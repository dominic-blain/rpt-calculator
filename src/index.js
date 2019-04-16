import './styles/reset.less';
import 'normalize.css';
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./components/App/App";

// Prevents double tap to zoom
var doubleTouchStartTimestamp = 0;
document.addEventListener("touchstart", function(event){
    var now = +(new Date());
    if (doubleTouchStartTimestamp + 500 > now){
        event.preventDefault();
    };
    doubleTouchStartTimestamp = now;
});

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app")
);