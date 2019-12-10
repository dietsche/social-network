import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import styled from "styled-components";

const ChatContainer = styled.div`
    height: 300px;
    overflow-y: auto;
`;

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector(state => state && state.chatMessages);
    console.log("chatMessages: ", chatMessages);

    useEffect(() => {
        console.log("chat mounted!");
        // console.log("elemRef.current: ", elemRef.current);
        console.log("scroll top: ", elemRef.current.scrollTop);
        console.log("height of the box: ", elemRef.current.clientHeight);
        console.log("scrollheight ", elemRef.current.scrollHeight);
        elemRef.current.ScrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);
    //not only when mounting, but also when new message comes in

    const keyCheck = e => {
        if (e.key === "Enter") {
            socket.emit("newChatMessage", e.target.value);
            console.log("e.target.value: ", e.target.value);
            e.target.value = "";
        }
    };
    return (
        <div>
            <h1>Chat Room</h1>
            <ChatContainer ref={elemRef}>
                ChatContainer
                <p>messages go here</p>
                <p>messages go here</p>
                <p>messages go here</p>
            </ChatContainer>
            <textarea
                placeholder="add your message here..."
                onKeyUp={keyCheck}
            ></textarea>
        </div>
    );
}
