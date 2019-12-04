import React, { useState, useEffect } from "react";
import axios from "./axios";
import styled from "styled-components";

const Button = styled.button`
    background-color: rgb(220, 220, 220);
    width: 110px;
    height: 60px;
    border: 3px rgb(111, 185, 143) solid;
    border-radius: 3px;
    margin: 10px;
    font-family: Arial;
    color: rgb(40, 36, 30);
    font-size: 14px;
    cursor: pointer;
    :hover {
        background-color: rgb(210, 210, 210);
    }
`;

export function FriendButton({ otherId }) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        console.log("button mounted, otherId, ownId: ", otherId);
        axios.get(`/friendshipstatus/${otherId}`).then(resp => {
            let friendshipStatus = resp.data.resultFriendship;
            console.log("friendshiostatus!!!", friendshipStatus[0]);
            console.log("own id", resp.data.ownId);
            if (!friendshipStatus[0]) {
                setButtonText("Send Friend Request");
            } else if (friendshipStatus[0].accepted) {
                setButtonText("Unfriend");
            } else {
                friendshipStatus[0].sender_id == resp.data.ownId
                    ? setButtonText("Cancel Friend Request")
                    : setButtonText("Accept Friend Request");
            }
        });
    }, [buttonText]);
    function submit() {
        console.log("click ob button, buttontext: ", buttonText);
        if (buttonText == "Send Friend Request") {
            axios.post(`/api/send-friend-request/${otherId}`).then(resp => {
                console.log(resp);
                setButtonText("");
            });
        }
        if (buttonText == "Accept Friend Request") {
            axios.post(`/api/accept-friend-request/${otherId}`).then(resp => {
                console.log(resp);
                setButtonText("");
            });
        }
        if (buttonText == "Unfriend" || buttonText == "Cancel Friend Request") {
            axios.post(`/api/end-friendship/${otherId}`).then(resp => {
                console.log(resp);
                setButtonText("");
            });
        }
    }
    return (
        <div>
            <Button onClick={submit}>{buttonText}</Button>
        </div>
    );
}
