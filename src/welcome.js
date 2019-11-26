import React from "react";
import Registration from "./registration";

export default function Welcome() {
    return (
        <div>
            <div className="headline">
                <h1>Welcome to my Social Network</h1>
            </div>
            <Registration />
        </div>
    );
}
