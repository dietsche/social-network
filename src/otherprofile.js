import React from "react";
import styled from "styled-components";
import axios from "./axios";
import { PicFrame } from "./profile";
import { FriendButton } from "./friendship-button";

const OtherProfileContainer = styled.div`
    display: flex;

    background: ${props => props.theme.primary};
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px;
    align-items: center;
    h1 {
        font-size: 22px;
    }
`;

const OtherBio = styled.div`
    display: flex;
    flex-direction: column;
    width: 400px;
    padding: 10px;
    align-items: center;
`;

export class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        axios
            .get("/api/otheruser/" + this.props.match.params.id)
            .then(({ data }) => {
                if (data.success) {
                    this.setState(
                        {
                            first: data.first,
                            last: data.last,
                            image: data.image,
                            bio: data.bio,
                            id: data.id
                        },
                        () => {
                            console.log("this.state.first: ", this.state.first);
                        }
                    );
                } else {
                    this.setState({
                        error: true
                    });
                    this.props.history.push("/");
                }
            });
    }
    render() {
        return (
            <OtherProfileContainer>
                <h1>
                    {" "}
                    {this.state.first} {this.state.last}
                </h1>
                <PicFrame>
                    <img src={this.state.image} />
                </PicFrame>
                <OtherBio>{this.state.bio}</OtherBio>
                <FriendButton
                    otherId={this.props.match.params.id}
                    ownId={this.state.id}
                />
            </OtherProfileContainer>
        );
    }
}
