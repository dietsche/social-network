import * as io from "socket.io-client";

import { loadChatMessages, newChatMessage, updateOnlineList } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("usersOnlineList", usersOnlineList => {
            store.dispatch(updateOnlineList(usersOnlineList));
        });

        socket.on("chatMessages", chatMessages =>
            store.dispatch(loadChatMessages(chatMessages))
        );

        socket.on("additionalMessage", msg => {
            store.dispatch(newChatMessage(msg));
        });
    }
};
