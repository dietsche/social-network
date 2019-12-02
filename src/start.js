import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";

import Welcome from "./welcome";
import App from "./app";

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
        background-color: rgb(241, 214, 171);
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
    elem = (
        <React.Fragment>
            <App />
            <GlobalStyle />
        </React.Fragment>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
