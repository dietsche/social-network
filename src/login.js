import React from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Form } from "./start";

const InputField = styled.input`
    margin: 15px 0 5px 6px;
    padding: 5px;
    border-radius: 3px;
    width: 220px;
    height: 26px;
    font-size: 17px;
`;

export default class Login extends React.Component {
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
                {this.state.error && (
                    <div className="error">
                        Something went wrong. Please try again!
                    </div>
                )}
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
                <button onClick={() => this.submit()}>Submit</button>
                <div>
                    {" "}
                    Already a member? Please <Link to="/">register!</Link>{" "}
                </div>
            </Form>
        );
    }
}

// submit() {
//     axios.post("/register", {
//         email: this.state.email, //State ist eigentliche for detecting changes on screen and reacting
//         password: this.state.password,
//         first: ""
//     }).then(({data}) => {
//         if (data.success) {
//             console.log("...");
//             location.replace('https://www.google.com'); //replace> page in history is replaced in history > you cant go back in browser!!!!
//
//         } else {
//             this.setState({
//                 error: true
//             })
//         }
//     });  //hier evtl noch catch mit error-meldung: aber nur für den Fall das z.B. Server nicht läuft
// }
// handleChange(inputElement) {
//     this.setState({ [inputElement.name]: inputElement.value });
// }
// render() {
//     return (
//         <div>
//             {this.state.error && <div className="error">Oops!</div>}
//             <input name="first" onChange={e => this.handleChange()} />
//             <input name="last" />
//             <input name="email" />
//             <input name="password" />
//             <button onClick={e => this.submit()}></button>
//         </div>
//     );
// }

//sauberer Version
