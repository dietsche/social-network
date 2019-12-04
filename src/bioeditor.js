import React from "react";
import styled from "styled-components";

const EditProfile = styled.div`
    display: flex;
    flex-direction: column;
    width: 400px;
    padding: 10px;
    align-items: center;
    textarea {
        width: 100%;
        min-height: 50px;
        border-radius: 5px;
        background-color: rgb(230, 230, 230);
        padding: 6px;
        font-family: Arial;
        font-size: 15px;
    }
    button {
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
`;

const ShowProfile = styled.div`
    display: flex;
    flex-direction: column;
    width: 400px;
    padding: 10px;
    align-items: center;
    button {
        background-color: rgb(220, 220, 220);
        width: 90px;
        height: 30px;
        border: 3px rgba(0, 0, 0, 0) solid;
        border-radius: 3px;
        margin: 10px;
        font-family: Arial;
        color: rgb(40, 36, 30);
        font-size: 15px;
        cursor: pointer;
    }
`;

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editText: "Edit Bio",
            bioText: ""
        };
        this.sendUpdateInfo = this.sendUpdateInfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
    }

    componentDidMount() {
        console.log("props in bioeditor: ", this.props);
        if (!this.props.bio) {
            //PROBLEM: props bei componentDidMount noch nicht da!!! Solution: in render: this.props.bio ? buttonText = "Efdit..." : buttonText = "Add.." ; und unten nicht auf state verweisen, sondern auf Variable
            // cooler: staic getDerivedStateFromProps(props, state) {.....} => achtet auf Props-Änderungen!
            this.setState(
                {
                    buttonText: "Add your bio"
                },
                () => console.log("this.state: ", this.state)
            );
        }
    }
    handleChange(event) {
        this.setState({ bioText: event.target.value }, () => {
            console.log("handleChange Func: this.state", this.state);
        });
    }
    handleEditClick() {
        this.setState({ editingMode: true }, () => {
            console.log("editingMode set to true");
        });
    }

    sendUpdateInfo() {
        this.state.bioText
            ? this.props.updateBio(this.state.bioText)
            : this.props.updateBio(this.props.bio);

        this.setState({ editingMode: false }, () => {
            console.log("editingMode set to false");
        });
    }

    render() {
        if (!this.props.bio || this.state.editingMode) {
            return (
                <EditProfile>
                    <textarea
                        onChange={this.handleChange}
                        defaultValue={this.props.bio}
                        // value={this.state.bioText}
                        placeholder="Please enter your bio."
                    />
                    <button onClick={this.sendUpdateInfo}> Save </button>
                </EditProfile>
            );
        } else if (this.props.bio) {
            return (
                <ShowProfile>
                    <p> {this.props.bio}</p>
                    <button onClick={this.handleEditClick}>
                        {" "}
                        {this.state.editText}{" "}
                    </button>
                </ShowProfile>
            );
        }
    }
}
