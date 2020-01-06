import axios from "./axios";

export async function receiveFriendsAndWannabes() {
    const { data } = await axios.get("/api/friends-wannabees");
    return {
        type: "RECEIVE_FRIENDS_AND_WANNABEES",
        friendsAndWannabees: data.friendsAndWannabees
    };
}

export async function acceptFriendRequest(id) {
    await axios.post("/api/accept-friend-request/" + id);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id
    };
}

export async function unfriend(id) {
    await axios.post("/api/end-friendship/" + id);
    return {
        type: "END_FRIENDSHIP",
        id
    };
}

export function loadChatMessages(chatMessages) {
    return {
        type: "GET_CHATMESSAGES",
        chatMessages
    };
}

export function newChatMessage(message) {
    return {
        type: "NEW_MESSAGE",
        message
    };
}

export function updateOnlineList(list) {
    return {
        type: "ONLINE_LIST",
        list
    };
}
