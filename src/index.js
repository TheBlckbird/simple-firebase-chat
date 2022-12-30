import { initializeApp } from "firebase/app";
import {
    getDatabase,
    ref,
    set,
    onValue,
    push,
    onChildAdded
} from "firebase/database";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "firebase/auth";

import { firebaseConfig } from "./firebaseConfig";

const firebaseApp = initializeApp(firebaseConfig);


const provider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);
// connectAuthEmulator(auth, "http://localhost:9099");

let userId = null;
let userName = null;

const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const chatForm = document.getElementById("chat-form");

loginButton.style.display = "block";
chatForm.style.display = "none";
logoutButton.style.display = "none";

onAuthStateChanged(auth, (user) => {
    if (user != null) {
        userId = user.uid;
        userName = user.displayName;
        loginButton.style.display = "none";
        chatForm.style.display = "block";
        logoutButton.style.display = "block";
    } else {
        userId = null;
        userName = null;
        loginButton.style.display = "block";
        chatForm.style.display = "none";
        logoutButton.style.display = "none";
    }
});

loginButton.addEventListener("click", (event) => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
        })
        .catch((error) => {
            console.log(error);
        });
});

logoutButton.addEventListener("click", (event) => {
    auth.signOut();
});


const db = getDatabase(firebaseApp);
const messagesReference = ref(db, "messages/");

function addMessage(message) {
    const newMessageReference = push(messagesReference);

    set(newMessageReference, {
        name: userName,
        message: message,
        userId: userId,
    });
}

function addMessageElement(message, name) {
    const messageElement = document.getElementById("messages");
    const html_to_insert = `<p>${name}: ${message}</p>`;
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
    event.preventDefault();
    const message = messageInput.value;
    messageInput.value = "";
    addMessage(message);
});