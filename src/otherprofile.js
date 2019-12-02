import React from "react";
import styled from "styled-components";
import axios from "./axios";
import { ProfileContainer, PicFrame } from "./profile";

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
        console.log("this.props.match: ", this.props.match);
        console.log("params id: ", this.props.match.params.id);
        //axios-request: zuästzlich zu user-data auf id-aus-cookie von server abfragen > kann verglichen werden [wenn wir id als property weitergeben> evtl. Verzögerung!!]

        //Set state

        //eigene Seite: redirection: this.props.match.params.id && [eigene Id] >> this.props.history.push("/");

        axios
            .get("/api/otheruser/" + this.props.match.params.id)
            .then(({ data }) => {
                if (data.success) {
                    console.log(
                        "data when app-component mounts: ",
                        data.first,
                        data.last
                    );
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
                    console.log("ERROR");
                    this.setState({
                        error: true
                    });
                    this.props.history.push("/");
                }
            });
    }
    render() {
        return (
            <ProfileContainer>
                <h1>
                    {" "}
                    {this.state.first} {this.state.last}
                </h1>
                <PicFrame>
                    <img src={this.state.image} />
                </PicFrame>
                <OtherBio>{this.state.bio}</OtherBio>
            </ProfileContainer>
        );
    }
}
