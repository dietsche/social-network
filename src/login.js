import React from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Form } from "./start";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    submit() {
        console.log("registration.js: Submit-func running");
        axios
            .post("/login", {
                email: this.email, //State ist eigentliche for detecting changes on screen and reacting
                password: this.password
                // image: this.image,
                // bio: this.bio
            })
            .then(({ data }) => {
                console.log("login!!!");
                if (data.success) {
                    console.log("data.sucess");
                    location.replace("/"); //replace> page in history is replaced in history > you cant go back in browser!!!!
                } else {
                    console.log("!!!data.sucess");
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

                <div>
                    {" "}
                    Already a member? Please <Link to="/">register!</Link>{" "}
                </div>
            </Form>
        );
    }
}
