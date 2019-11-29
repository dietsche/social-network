import React from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Form } from "./start";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    submit() {
        console.log("registration.js: Submit-func running");
        console.log(this.email);
        console.log(this.first);
        console.log(this.last);
        console.log(this.password);
        axios
            .post("/registration", {
                email: this.email, //State ist eigentliche for detecting changes on screen and reacting
                password: this.password,
                first: this.first,
                last: this.last
                // image: this.image,
                // bio: this.bio
            })
            .then(({ data }) => {
                console.log("registration.js: axios-post .then");
                if (data.success) {
                    console.log("...");
                    location.replace("/"); //replace> page in history is replaced in history > you cant go back in browser!!!!
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    handleChange(inputElement) {
        console.log(inputElement.target.name);
        console.log(inputElement.target.value);
        this[inputElement.target.name] = inputElement.target.value;
    }
    render() {
        return (
            <Form>
                <input
                    name="first"
                    type="text"
                    placeholder="First Name"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="last"
                    type="text"
                    placeholder="Last Name"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={e => this.handleChange(e)}
                />
                {this.state.error && (
                    <div className="error">
                        Something went wrong. Please try again!
                    </div>
                )}

                <button onClick={() => this.submit()}>Submit</button>

                <div className="switch">
                    {" "}
                    Already a member? Please <Link to="/login">log in!</Link>
                </div>
            </Form>
        );
    }
}
