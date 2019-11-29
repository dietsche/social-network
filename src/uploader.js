import React from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";

const ModalContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 30;
    > div {
        display: flex;
        align-items: center;
        flex-direction: column;
        height: 240px;
        width: 30%;
        border-radius: 5px;
        padding: 10px 30px;
        background-color: white;
        > h2 {
            margin-top: 10px;
            font-size: 18px;
        }
        > div {
            align-self: flex-end;
            color: black;
            font-family: Tahoma;
            font-size: 40px;
            cursor: pointer;
        }
        > input {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }
        > label {
            width: 110px;
            height: 40px;
            border: 3px rgb(0, 0, 0, 0) solid;
            border-radius: 3px;
            background-color: rgb(220, 220, 220);
            font-family: Arial;
            color: rgb(40, 36, 30);
            font-size: 14px;
            font-weight: bold;
            margin: 10px;
            padding: 0 15px;
            cursor: pointer;
            > div {
                height: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                img {
                    height: 20px;
                }
            }
        }
        > button {
            background-color: rgb(111, 185, 143);
            width: 110px;
            height: 40px;
            border: 3px rgba(0, 0, 0, 0) solid;
            border-radius: 3px;
            margin: 10px;
            font-family: Arial;
            color: rgb(40, 36, 30);
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
        }
    }
`;

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            image: null,
            imageloaded: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sendImage = this.sendImage.bind(this);
    }

    sendImage(url) {
        console.log("sendImage runs");
        console.log(url);
        this.props.sendImageToApp(url);
    }

    componentDidMount() {
        console.log("uploader mounted");
        console.log("this.props ", this.props);
    }

    handleChange(e) {
        console.log("e.target.files[0]", e.target.files[0]);
        this.setState({ file: e.target.files[0] });
        this.setState({ imageLoaded: true });
    }

    handleClick() {
        console.log("thisfile:", this.state.file);
        var fd = new FormData();
        fd.append("file", this.state.file);
        let me = this;

        axios.post("/uploadImage", fd).then(function(resp) {
            console.log("resp.data.image: ", resp.data.image);
            // console.log("htis props: ", this.props);
            me.sendImage(resp.data.image);
        });
    }
    render() {
        const imageLoaded = this.state.imageLoaded;
        return (
            <ModalContainer>
                <div>
                    <div onClick={this.props.toggleModal}>&times;</div>
                    <h2> Upload new profile image</h2>
                    <input
                        onChange={this.handleChange}
                        type="file"
                        name="file"
                        id="file"
                        accept="image/*"
                    />
                    <label htmlFor="file">
                        {imageLoaded ? (
                            <div>
                                <img src="img/check.png" alt="" />
                                <span>Image loaded</span>
                            </div>
                        ) : (
                            <div>
                                <img src="img/upload.png" alt="" />
                                <span>Load Image</span>
                            </div>
                        )}
                    </label>

                    <button onClick={this.handleClick}>Submit</button>
                </div>
            </ModalContainer>
        );
    }
}
