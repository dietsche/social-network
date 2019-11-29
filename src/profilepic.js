import React from "react";

export function ProfilePic({ first, last, image }) {
    console.log("props in profilepic: ", first, last, image);
    image = image || "/img/robin.png";

    return (
        <React.Fragment>
            <img src={image} alt={(first, last)} />
        </React.Fragment>
    );
}
