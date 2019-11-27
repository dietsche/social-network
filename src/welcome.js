import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import styled from "styled-components";

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
        text-align: center;
        margin-top: 20px;
    }
    img {
        width: 10vw;
        margin: 20px;
    }
`;

export default function Welcome() {
    return (
        <React.Fragment>
            <Header>
                <img src="/img/robin.png" />
                <h1>Welcome to my Social Network</h1>
            </Header>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </React.Fragment>
    );
}
