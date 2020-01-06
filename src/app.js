import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import styled from "styled-components";
import { Profile } from "./profile";
import { ProfilePic } from "./profilepic";
import Uploader from "./uploader";
import { OtherProfile } from "./otherprofile";
import { FindPeople } from "./findpeople";
import Friends from "./friends";
import Chat from "./chat";

const AppContainer = styled.div`
    height: 100vh;
    overflow-y: hidden;
`;

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 50px;
    background-color: rgb(83, 125, 145);
    padding: 12px;
    margin-bottom: 30px;
    > img {
        height: 50px;
        margin-left: 5px;
    }
`;
const Navigation = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    div {
        margin: auto 20px;
    }
`;

const PicFrame = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px rgb(150, 150, 150) solid;
    background-color: white;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    overflow: hidden;
    margin-right: 20px;
    cursor: pointer;
    img {
        object-fit: contain;
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
        axios.get("/api/user").then(({ data }) => {
            if (data.success) {
                this.setState({
                    first: data.first,
                    last: data.last,
                    image: data.image,
                    bio: data.bio,
                    id: data.id
                });
            } else {
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
        let me = this;
        axios.post("/updateBio", { bio: bioText }).then(function(resp) {
            me.setState(
                {
                    bio: resp.data.bio
                },
                () => {
                    "state of bio is set to new value";
                }
            );
        });
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }

    render() {
        if (!this.state.first) {
            return null;
        }
        return (
            <React.Fragment>
                <BrowserRouter>
                    <AppContainer>
                        <Header>
                            <img src="/img/logo.png" />
                            <Navigation>
                                <div>
                                    {" "}
                                    <NavLink
                                        exact
                                        to="/"
                                        style={{
                                            color: "white",
                                            textDecoration: "none"
                                        }}
                                        activeStyle={{
                                            color: "black",
                                            textDecoration: "none"
                                        }}
                                    >
                                        My Profile
                                    </NavLink>
                                </div>
                                <div>
                                    {" "}
                                    <NavLink
                                        exact
                                        to="/friends"
                                        style={{
                                            color: "white",
                                            textDecoration: "none"
                                        }}
                                        activeStyle={{
                                            color: "black",
                                            textDecoration: "none"
                                        }}
                                    >
                                        Friends
                                    </NavLink>
                                </div>

                                <div>
                                    {" "}
                                    <NavLink
                                        to="/findpeople"
                                        style={{
                                            color: "white",
                                            textDecoration: "none"
                                        }}
                                        activeStyle={{
                                            color: "black",
                                            textDecoration: "none"
                                        }}
                                    >
                                        Search
                                    </NavLink>
                                </div>
                                <div>
                                    {" "}
                                    <NavLink
                                        to="/chat"
                                        style={{
                                            color: "white",
                                            textDecoration: "none"
                                        }}
                                        activeStyle={{
                                            color: "black",
                                            textDecoration: "none"
                                        }}
                                    >
                                        Chat
                                    </NavLink>
                                </div>
                                <div>
                                    <a
                                        href="/logout"
                                        style={{
                                            color: "white",
                                            textDecoration: "none"
                                        }}
                                        activeStyle={{
                                            color: "black",
                                            textDecoration: "none"
                                        }}
                                    >
                                        Logout
                                    </a>
                                </div>

                                <PicFrame onClick={this.toggleModal}>
                                    <ProfilePic
                                        toggleModal={this.toggleModal}
                                        first={this.state.first}
                                        last={this.state.last}
                                        image={this.state.image}
                                    />
                                </PicFrame>
                            </Navigation>
                        </Header>

                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    image={this.state.image}
                                    bio={this.state.bio}
                                    updateBio={this.updateBio}
                                    toggleModal={this.toggleModal}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/findpeople"
                            render={() => <FindPeople first={this.state.id} />}
                        />
                        <Route
                            exact
                            path="/chat"
                            render={() => <Chat first={this.state.id} />}
                        />
                        <Route
                            exact
                            path="/friends"
                            render={() => <Friends />}
                        />

                        <Route path="/user/:id" component={OtherProfile} />
                    </AppContainer>

                    {this.state.uploaderIsVisible && (
                        <Uploader
                            toggleModal={this.toggleModal}
                            sendImageToApp={this.getImageFromUploader}
                        />
                    )}
                </BrowserRouter>
            </React.Fragment>
        );
    }
}
