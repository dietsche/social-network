export default function reducer(state = {}, action) {
    console.log("state in reducer: ", state);

    if (action.type == "RECEIVE_FRIENDS_AND_WANNABEES") {
        state = {
            ...state,
            friendsAndWannabees: action.friendsAndWannabees
        };
    }

    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsAndWannabees: state.friendsAndWannabees.map(person => {
                if (person.id == action.id) {
                    return {
                        ...person,
                        accepted: true
                    };
                } else {
                    return person;
                }
            })
        };
    }

    if (action.type == "END_FRIENDSHIP") {
        state = {
            ...state,
            friendsAndWannabees: state.friendsAndWannabees.filter(
                person => person.id !== action.id
            )
        };
    }

    if (action.type == "GET_CHATMESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }

    if (action.type == "NEW_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.message]
        };
    }

    if (action.type == "ONLINE_LIST") {
        state = {
            ...state,
            onlineList: action.list
        };
    }

    console.log("reducer: state ended as: ", state);
    return state;
}
