import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import axios from "./axios";

export const ContainerFindPeople = styled.div`
    display: flex;
    justify-content: space-around;
    height: calc(100vh - 50px);
    overflow-y: auto;
`;

export const FindUsers = styled.div`
    > input {
        margin: 7px auto;
        padding: 5px;
        border-radius: 3px;
        width: 220px;
        height: 26px;
        font-size: 17px;
    }
`;
export const LatestUsers = styled.div``;

export const ContainerUser = styled.div`
    display: flex;
    align-items: center;
    min-height: 100px;
    width: 25%;
    min-width: 300px;
    background-color: white;
    margin: 10px auto;
    > div {
        height: 100px;
        width: 100px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
            min-height: 100%;
            min-width: 100%;
            object-fit: cover;
        }
    }
    .name-container {
        min-width: 200px;
    }
`;
export function FindPeople() {
    console.log("FindPeople running ");
    //useState: arrray of user ; string(val of textField)
    //userEffect: do something when comp mounts (ajax-req to get users; order by id desc limit 3)+ after every render after (new request after new inputvalue)
    //value of TextField > useState
    const [latestUsers, setLatestUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [val, setVal] = useState();
    // if (!latestUsers) {
    //     return null;
    // }

    useEffect(() => {
        console.log("componentDidMount!");
        (async () => {
            const { data } = await axios.get(`/api/findlatestusers`);
            setLatestUsers(data.latestUsers);
            console.log("data: ", data);
        })();
    }, [latestUsers.id]);

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
                            <ContainerUser key={user.id}>
                                <div className="image-container">
                                    <img src={user.image} />
                                </div>
                                <div className="name-container">
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </div>
                            </ContainerUser>
                        ))}
                </FindUsers>

                <LatestUsers>
                    <h2> Joined recently </h2>{" "}
                    {latestUsers.map(user => (
                        <ContainerUser key={user.id}>
                            <div className="image-container">
                                <img src={user.image} />
                            </div>
                            <div className="name-container">
                                <p>
                                    {user.first} {user.last}
                                </p>
                            </div>
                        </ContainerUser>
                    ))}
                </LatestUsers>
            </ContainerFindPeople>
        </React.Fragment>
    );
}
