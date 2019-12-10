import React, { useState, useEffect } from "react";
import axios from "./axios";
import styled from "styled-components";

import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsAndWannabes,
    acceptFriendRequest,
    unfriend
} from "./actions";

export const Headline = styled.div`
    text-align: center;
    margin-bottom: 10px;
    h2 {
        font-size: 16px;
        margin: 20px auto;
    }
`;

export const WannabeesContainer = styled.div`
    display: flex;

    justify-content: center;
    flex-wrap: wrap;
`;

export const FriendsContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
`;

export const PersonBox = styled.div`
    display: flex;
    justify-content: flex-start;
    wrap: flex-wrap;
    height: 100px;
    background-color: white;
    margin: 10px;

    box-shadow: 2px 2px 3px;
    > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    > .image-container {
        width: 100px;
        height: 100px;
        overflow: hidden;
        > img {
            object-fit: cover;
            width: 100%;
            min-height: 100%;
        }
    }
    > .text-container {
        width: 200px;
    }
    button {
        background-color: rgb(220, 220, 220);
        height: 28px;
        border: 3px rgba(0, 0, 0, 0) solid;
        border-radius: 3px;
        margin: 10px;
        font-family: Arial;
        color: rgb(40, 36, 30);
        font-size: 15px;
        cursor: pointer;
    }
`;

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(state => {
        //           console.log('in function passed to useSelector', state)

        return (
            state.friendsAndWannabees &&
            state.friendsAndWannabees.filter(user => user.accepted == true)
        );
    });

    const wannabees = useSelector(state => {
        return (
            state.friendsAndWannabees &&
            state.friendsAndWannabees.filter(user => user.accepted == false)
        );
    });

    useEffect(() => {
        dispatch(receiveFriendsAndWannabes());
    }, []);

    // if (!friends) {
    //     return null;
    // } else {
    //     console.log("friends: ", friends);
    // }
    console.log("FRIENDS: ", friends);
    console.log("WANNABEES: ", wannabees);

    return (
        <React.Fragment>
            {wannabees && wannabees.length != 0 && (
                <Headline>
                    <h2>These people want to add you as a friend</h2>
                </Headline>
            )}
            <WannabeesContainer>
                {wannabees &&
                    wannabees.map(wannabee => (
                        <PersonBox key={wannabee.id}>
                            <div className="image-container">
                                <img src={wannabee.image} />
                            </div>
                            <div className="text-container">
                                <p>
                                    {wannabee.first} {wannabee.last}
                                </p>
                                <button
                                    onClick={() =>
                                        dispatch(
                                            acceptFriendRequest(wannabee.id)
                                        )
                                    }
                                >
                                    Accept Friendship
                                </button>
                            </div>
                        </PersonBox>
                    ))}
            </WannabeesContainer>
            <Headline>
                {friends && friends.length != 0 ? (
                    <h2>These are your friends</h2>
                ) : (
                    <h2> No friends... </h2>
                )}
            </Headline>
            <FriendsContainer>
                {friends &&
                    friends.map(friend => (
                        <PersonBox key={friend.id}>
                            <div className="image-container">
                                <img src={friend.image} />
                            </div>
                            <div className="text-container">
                                <p>
                                    {friend.first} {friend.last}
                                </p>
                                <button
                                    onClick={() =>
                                        dispatch(unfriend(friend.id))
                                    }
                                >
                                    Unfriend
                                </button>
                            </div>
                        </PersonBox>
                    ))}
            </FriendsContainer>
        </React.Fragment>
    );
}
