import { firebaseApp } from "./firebase-connection/firebaseConnect";
import {
    getDatabase,
    ref,
    set,
    onValue,
    push,
    onChildAdded
} from "firebase/database";
import { userId, userName } from "./auth";

const db = getDatabase(firebaseApp);
const messagesReference = ref(db, "messages/");

function escapeHtml(unsafe)
{
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function addMessage(message) {
    const newMessageReference = push(messagesReference);
    const escapedMessage = escapeHtml(message);

    set(newMessageReference, {
        name: userName,
        message: escapedMessage,
        userId: userId,
    });
}

function addMessageElement(message, name) {
    if (message.length === 0 || message.length > 200) {
        return
    }

    const escapedMessage = escapeHtml(message);

    const messageElement = document.getElementById("messages");
    const html_to_insert = `<p>${name}: ${escapedMessage}</p>`;
    messageElement.insertAdjacentHTML("afterbegin", html_to_insert);
}

onChildAdded(messagesReference, (data) => {
    const message = data.val().message;
    const name = data.val().name;
    addMessageElement(message, name);
});

const messageInput = document.getElementById("message");
messageInput.focus();

const form = document.getElementById("chat-form");
form.addEventListener("submit", (event) => {
    if (messageInput.value.length === 0 || messageInput.value.length > 200 || userId === null) {
        return
    }
    event.preventDefault();
    const message = messageInput.value;
    messageInput.value = "";
    addMessage(message);
    console.log(userName);
});