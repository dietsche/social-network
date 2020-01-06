import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { Form } from "./start";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    submit() {
        axios
            .post("/login", {
                email: this.email,
                password: this.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    handleChange(inputElement) {
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
