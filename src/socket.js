import * as io from "socket.io-client";

// import { loadChatMessages, newMessage } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        //All out dispatches of actions will go in here...

        socket.on("chatMessages", chatMessages =>
            store.dispatch(loadChatMessages(chatMessages))
        );

        socket.on("newChatMessage", msg => store.dispatch(newChatMessage(msg)));

        socket.on("newMessageToClient", msg => {
            console.log("show new message to all users: ", msg);
        });
    }
};
