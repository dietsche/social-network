// receiveFriendsWannabes: will make GET request to server to retrieve the list of friends and wannabes
//     note: if you get back an empty array from the server, that either means (1) there's a bug, or (2) you have no friends :(
//     receiveFriendsWannabes should return an action with a type and a friendsWannabes property whose value is the array of friends and wannabes
// acceptFriendRequest: will make POST request to server to accept the friendship in the database. This function should return an object with type and the id of the user whose friendship was accepted
// unfriend: will make POST requet to server to end friendship in database. This function should return an object with type and id of the user whose friendship was ended
import axios from "./axios";

export async function receiveFriendsAndWannabes() {
    const { data } = await axios.get("/api/friends-wannabees");
    console.log("receiveFriendsAndWannabees - data from server: ", data);
    return {
        type: "RECEIVE_FRIENDS_AND_WANNABEES",
        friendsAndWannabees: data.friendsAndWannabees
    };
}

export async function acceptFriendRequest(id) {
    console.log("id: ", id);
    await axios.post("/api/accept-friend-request/" + id);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id
    };
}

export async function unfriend(id) {
    console.log("id: ", id);
    await axios.post("/api/end-friendship/" + id);
    return {
        type: "END_FRIENDSHIP",
        id
    };
}
