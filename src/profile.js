import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { ProfilePic } from "./profilepic";
import BioEditor from "./bioeditor";

const theme = {
    primary: "rgb(240,240,240)",
    secondary: "green"
};
export const ProfileContainer = styled.div`
    background: ${props => props.theme.primary};
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
    width: 250px;
    height: 250px
    overflow: hidden;
    margin-right: 20px;
    > img {
        object-fit: contain;
        min-width: 100%;
        min-height: 100%;
    }
`;

export function Profile({
    first,
    last,
    image,
    bio,
    updateBio,
    id,
    toggleModal
}) {
    console.log("profile running; currentID: ", id);
    return (
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
    );
}
