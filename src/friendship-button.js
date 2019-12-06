import React, { useState, useEffect } from "react";
import axios from "./axios";
import styled from "styled-components";

const Button = styled.button`
    background-color: rgb(90, 160, 120);
    width: 110px;
    height: 60px;
    border-radius: 3px;
    margin: 10px;
    font-family: Arial;
    color: white;
    font-size: 14px;
    cursor: pointer;
    :hover {
        background-color: rgb(70, 140, 100);
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
