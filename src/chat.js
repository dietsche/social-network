import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getRhyme } from "./getrhymes";

var moment = require("moment");
let repeatRhyme = false;
let everySecondTime = true;

export const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
        font-size: 20px;
    }
`;

export const ChatFrame = styled.div`
    height: 400px;
    width: 700px;
    overflow-y: scroll;
    background-color: rgb(240, 240, 240);
    .message-container {
        display: flex;
        align-items: center;
        min-height: 40px;
        margin: 5px auto;
        background-color: white;
        .image-box {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 50px;
            width: 50px;
            margin-right: 10px;
            overflow: hidden;
            img {
                object-fit: contain;
                max-width: 70px;
            }
        }
        .message-box {
            .name {
                color: darkred;
            }
            .time {
                font-style: italic;
            }
        }
    }
`;

export const EnterMessage = styled.div`
    display: flex;

    textarea {
        width: 500px;
        height: 70px;
        border-radius: 5px;
        background-color: rgb(230, 230, 230);
        padding: 6px;
        font-family: Arial;
        font-size: 15px;
    }
    > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 13px;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        margin: 5px 10px;
        cursor: pointer;
    }
    .lame {
        background-color: rgb(104, 255, 104);
    }
    .lame2 {
        background-color: rgb(0, 204, 0);
    }
`;

export function insertRhyme(rhyme) {
    console.log("currentRhyme: ", rhyme);
    socket.emit("newChatMessage", rhyme);
}

export default function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);
    let currentRhyme;
    const elemRef = useRef();

    useEffect(() => {
        console.log("chat mounted!");
        console.log("repeatRhyme: ", repeatRhyme);
        console.log("elemRef.current: ", elemRef.current);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        if (repeatRhyme == true) {
            console.log("repeat true");
            everySecondTime &&
                getRhyme(chatMessages[chatMessages.length - 1].message);
            everySecondTime = !everySecondTime;
        }
    }, [chatMessages]);

    const keyCheck = e => {
        if (e.key === "Enter") {
            socket.emit("newChatMessage", e.target.value);
            e.target.value = "";
        }
    };

    console.log("chatMessages before return: ", chatMessages);

    async function showRhyme() {
        try {
            currentRhyme = await getRhyme(
                chatMessages[chatMessages.length - 1].message
            );
            console.log("!!!!!!!!!!!!!!!current r : ", currentRhyme);
        } catch (error) {
            console.log("error: ", error);
        }
    }

    function initRhyme() {
        showRhyme().then(response => {
            console.log("!!!!!!!!!!!!!!currentRhyme:", response);
        });
        repeatRhyme = false;
    }

    function initRepeatedRhyme() {
        console.log("rr set to true");
        repeatRhyme = true;
    }

    return (
        <ChatContainer>
            <h1>Chat Room</h1>
            <ChatFrame ref={elemRef}>
                {chatMessages &&
                    chatMessages.map(item => {
                        return (
                            <div
                                key={item.message_id}
                                className="message-container"
                            >
                                <div className="image-box">
                                    <img src={item.image} />
                                </div>
                                <div className="message-box">
                                    <p>
                                        {" "}
                                        <span className="name">
                                            {item.first} {item.last}{" "}
                                        </span>
                                        <span className="time">
                                            {moment(item.created_at).format(
                                                "YYYY-MM-DD hh:mm:ss"
                                            )}
                                        </span>
                                    </p>
                                    <p> {item.message}</p>
                                </div>
                            </div>
                        );
                    })}
            </ChatFrame>
            <EnterMessage>
                <textarea
                    placeholder="add your message here..."
                    onKeyUp={keyCheck}
                ></textarea>
                <div className="lame" onClick={initRhyme}>
                    <div>autoreply</div>
                    <strong>1x</strong>
                </div>
                <div className="lame2" onClick={initRepeatedRhyme}>
                    <div>autoreply</div>
                    <strong>++</strong>{" "}
                </div>
            </EnterMessage>
        </ChatContainer>
    );
}
