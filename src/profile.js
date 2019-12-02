import React from "react";
import styled from "styled-components";
import { ProfilePic } from "./profilepic";
import BioEditor from "./bioeditor";

export const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px;
    /* justify-content: center; */
    align-items: center;
    h1 {
        font-size: 22px;
    }
`;

export const PicFrame = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px white solid;
    max-width: 250px;
    overflow: hidden;
    margin-right: 20px;
`;

export function Profile({ first, last, image, bio, updateBio, toggleModal }) {
    console.log("profile running ");
    return (
        <ProfileContainer>
            <h1>
                {" "}
                {first} {last}
            </h1>
            <PicFrame onClick={toggleModal}>
                <ProfilePic first={first} last={last} image={image} />
            </PicFrame>
            <BioEditor
                first={first}
                last={last}
                bio={bio}
                updateBio={updateBio}
            />
        </ProfileContainer>
    );
}
