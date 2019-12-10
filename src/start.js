import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import Welcome from "./welcome";
import App from "./app";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import { Provider } from "react-redux";
import { init } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

export const Form = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    input {
        margin: 7px auto;
        padding: 5px;
        border-radius: 3px;
        width: 220px;
        height: 26px;
        font-size: 17px;
    }
    button {
        margin: 7px auto;
        width: 100px;
        height: 40px;
        border-radius: 3px;
        border: 2px rgb(80, 80, 80) solid;
        background: rgb(240, 80, 5);
        color: rgb(222, 222, 222);
        font-size: 18px;
    }
    .switch {
    }
    .error {
        color: red;
    }
`;

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: Arial;
        background-color: rgb(240, 240, 240);
    }
    button, a {
        cursor: pointer;
    }
`;

let elem = (
    <React.Fragment>
        <Welcome />
        <GlobalStyle />
    </React.Fragment>
);

if (location.pathname != "/welcome") {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
            <GlobalStyle />
        </Provider>
    );
}
// change to:
// <Provider store={store}>
//     <App />
//     <GlobalStyle />
// </Provider>

ReactDOM.render(elem, document.querySelector("main"));
