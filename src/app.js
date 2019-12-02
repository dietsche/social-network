import React from "react";
import axios from "./axios"; //not directly from axis, but our own version
import { BrowserRouter, Route } from "react-router-dom"; //Do I need it here???
import styled from "styled-components";
import { Profile } from "./profile";
import { ProfilePic } from "./profilepic";
import Uploader from "./uploader";
import { OtherProfile } from "./otherprofile";

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 55px;
    background-color: rgba(50, 50, 50, 0.5);
    padding: 15px;
    > img {
        height: 75%;
        margin: 6px;
    }
`;

const PicFrame = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 4px darkred solid;
    background-color: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    overflow: hidden;
    margin-right: 20px;
    cursor: pointer;
    img {
        object-fit: fill;
        min-width: 100%;
        min-height: 100%;
    }
`;
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null, //brauch ich das hier???
            id: null,
            uploaderIsVisible: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.getImageFromUploader = this.getImageFromUploader.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }
    componentDidMount() {
        console.log("app componentDidMount");

        axios.get("/api/user").then(({ data }) => {
            console.log("app.js: axios-get");
            if (data.success) {
                console.log("data when app-component mounts: ", data);
                this.setState({
                    first: data.first,
                    last: data.last,
                    image: data.image,
                    bio: data.bio,
                    id: data.id
                });
                // location.replace("/"); //replace> page in history is replaced in history > you cant go back in browser!!!!
            } else {
                console.log("ERROR");
                this.setState({
                    error: true
                });
            }
        });
    }
    getImageFromUploader(imageurl) {
        this.setState({ image: imageurl, uploaderIsVisible: false });
    }

    updateBio(bioText) {
        console.log("UpdateBIO runs!!!!!!:", bioText);
        let me = this;
        axios.post("/updateBio", { bio: bioText }).then(function(resp) {
            console.log("bioupdate resp.data: ", resp.data.bio);
            me.setState(
                {
                    bio: resp.data.bio
                },
                () => {
                    "state of bio is set to new value";
                }
            );

            // console.log("htis props: ", this.props);
        });
    }

    toggleModal() {
        console.log("toogle modal is running!");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }

    render() {
        if (!this.state.image) {
            //Seite lädt erst wenn INhalt da ist!!!! HIER AUCH SPINNER MÖGLICH!!!
            return null;
        }
        return (
            <React.Fragment>
                <BrowserRouter>
                    <div>
                        <Header>
                            <img src="/img/robin.png" />
                            <PicFrame onClick={this.toggleModal}>
                                <ProfilePic
                                    toggleModal={this.toggleModal}
                                    first={this.state.first}
                                    last={this.state.last}
                                    image={this.state.image}
                                />
                            </PicFrame>
                        </Header>

                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    image={this.state.image}
                                    bio={this.state.bio}
                                    updateBio={this.updateBio}
                                    toggleModal={this.toggleModal}
                                />
                            )}
                        />
                        <Route path="/user/:id" component={OtherProfile} />
                    </div>
                </BrowserRouter>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        toggleModal={this.toggleModal}
                        sendImageToApp={this.getImageFromUploader}
                    />
                )}
            </React.Fragment>
        );
    }
}
