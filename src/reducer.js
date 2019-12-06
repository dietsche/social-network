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

    console.log("reducer: state ended as: ", state);
    return state;
}
