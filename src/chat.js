import React, { useEffect, useState, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getRhyme } from "./getrhymes";

var moment = require("moment");
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
        font-size: 16px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin: 5px 10px;
        cursor: pointer;
        img {
            margin-top: 5px;
            postion: absolute;
        }
    }
    > div:hover,
    .active {
        background-color: rgb(0, 204, 0);
    }
`;

export default function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);
    let currentRhyme;
    const elemRef = useRef();
    const [repeatRhyme, setRepeatRhyme] = useState(false);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        if (repeatRhyme == true) {
            everySecondTime = !everySecondTime;
            console.log("repeat true");
            everySecondTime &&
                showRhyme(chatMessages[chatMessages.length - 1].message);
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
            socket.emit("newChatMessage", currentRhyme);
        } catch (error) {
            console.log("error in showRhyme: ", error);
            setRepeatRhyme(false);
        }
    }

    function initRepeatedRhyme() {
        setRepeatRhyme(!repeatRhyme);
        everySecondTime = true;
        showRhyme();
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
                <div onClick={showRhyme}>
                    <div></div>
                    <img src="img/reply.png" />
                    <strong>1x</strong>
                </div>
                {repeatRhyme ? (
                    <div className="active" onClick={initRepeatedRhyme}>
                        <div></div>
                        <img src="img/reply.png" />
                        <strong>++</strong>{" "}
                    </div>
                ) : (
                    <div onClick={initRepeatedRhyme}>
                        <div></div>
                        <img src="img/reply.png" />
                        <strong>++</strong>{" "}
                    </div>
                )}
            </EnterMessage>
        </ChatContainer>
    );
}
