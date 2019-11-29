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

// const Dots = styled.div`
//     width: 100vh;
//     height: 100vh;
//     display: grid;
//     grid-template-rows: repeat(3, 1fr);
//     grid-template-columns: repeat(3, 1fr);
//     justify-items: center;
//     align-items: center;
//
//     div {
//         width: 20vh;
//         height: 20vh;
//         background-color: lightgrey;
//         border-radius: 50%;
//         animation: fade 1.5s alternate ease-in-out infinite;
//     }
//
//     div:nth-of-type(2),
//     div:nth-of-type(4) {
//         animation-delay: 0.25s;
//     }
//
//     div:nth-of-type(3),
//     div:nth-of-type(5),
//     div:nth-of-type(7) {
//         animation-delay: 0.5s;
//     }
//
//     div:nth-of-type(6),
//     div:nth-of-type(8) {
//         animation-delay: 0.75s;
//     }
//
//     div:nth-of-type(9) {
//         animation-delay: 1s;
//     }
//
//     @keyframes fade {
//         to {
//             opacity: 0.2;
//         }
//     }
// `;

// <Dots>
//     <div></div>
//     <div></div>
//     <div></div>
//     <div></div>
//     <div></div>
//     <div></div>
//     <div></div>
//     <div></div>
//     <div></div>{" "}
// </Dots>
//

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
