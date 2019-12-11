import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import axios from "./axios";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

// import { Link } from "react-router";

export const ContainerFindPeople = styled.div`
    display: flex;
    justify-content: space-around;
    height: calc(100vh - 50px);
    overflow-y: auto;
`;

export const FindUsers = styled.div`
    min-width: 340px;
    > input {
        margin: 7px auto;
        padding: 5px;
        border-radius: 3px;
        width: 220px;
        height: 26px;
        font-size: 17px;
    }
    > h2 {
        font-size: 16px;
        margin: 20px auto;
    }
`;

export const ContainerUser = styled.div`
    display: flex;
    align-items: center;
    min-height: 100px;
    width: 25%;
    min-width: 300px;
    background-color: white;
    margin: 10px auto;
    box-shadow: 2px 2px 3px;

    > div {
        height: 100px;
        width: 100px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
            min-height: 100%;
            width: 100%;
            object-fit: cover;
        }
    }
    .name-container {
        min-width: 200px;
    }
`;
export function FindPeople() {
    console.log("FindPeople running ");
    const onlineList = useSelector(state => state && state.onlineList);

    const [latestUsers, setLatestUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [val, setVal] = useState();

    useEffect(() => {
        console.log("componentDidMount!");
        (async () => {
            const { data } = await axios.get(`/api/findlatestusers`);
            setLatestUsers(data.latestUsers);
            console.log("data: ", data);
        })();
    }, [latestUsers.id]);

    useEffect(() => {
        console.log("OOOOOOOOOOOOOOOonlineList: ", onlineList);
    }, []);

    useEffect(() => {
        console.log("val: ", val);
        let ignore = false;
        (async () => {
            const { data } = await axios.get(`/api/searchusers/` + val);
            if (!ignore) {
                console.log(data.searchResult);
                setSearchResult(data.searchResult);
            } else {
                setSearchResult([]);
            }
        })();
        return () => (ignore = true);
    }, [val]);

    return (
        <React.Fragment>
            <ContainerFindPeople>
                <FindUsers>
                    <h2>Search users </h2>{" "}
                    <input
                        // defaultValue={greetee.val}
                        onChange={e => setVal(e.target.value)}
                    />
                    {searchResult &&
                        searchResult.map(user => (
                            <NavLink
                                key={user.id}
                                to={`/user/${user.id}`}
                                style={{
                                    color: "black",
                                    textDecoration: "none"
                                }}
                            >
                                <ContainerUser>
                                    <div className="image-container">
                                        <img src={user.image} />
                                    </div>
                                    <div className="name-container">
                                        <p>
                                            {user.first} {user.last}
                                        </p>
                                    </div>
                                </ContainerUser>
                            </NavLink>
                        ))}
                </FindUsers>

                <FindUsers>
                    <h2> Joined recently </h2>{" "}
                    {latestUsers.map(user => (
                        <NavLink
                            key={user.id}
                            to={`/user/${user.id}`}
                            style={{
                                color: "black",
                                textDecoration: "none"
                            }}
                        >
                            <ContainerUser>
                                <div className="image-container">
                                    <img src={user.image} />{" "}
                                </div>
                                <div className="name-container">
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </div>
                            </ContainerUser>
                        </NavLink>
                    ))}
                </FindUsers>
                <FindUsers>
                    <h2> Currently Online </h2>{" "}
                    {onlineList &&
                        onlineList.map(user => (
                            <NavLink
                                key={user.id}
                                to={`/user/${user.id}`}
                                style={{
                                    color: "black",
                                    textDecoration: "none"
                                }}
                            >
                                <ContainerUser>
                                    <div className="image-container">
                                        <img src={user.image} />{" "}
                                    </div>
                                    <div className="name-container">
                                        <p>
                                            {user.first} {user.last}
                                        </p>
                                    </div>
                                </ContainerUser>
                            </NavLink>
                        ))}
                </FindUsers>
            </ContainerFindPeople>
        </React.Fragment>
    );
}
