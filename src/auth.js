import { firebaseApp } from "./firebase-connection/firebaseConnect";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);

export let userId = null;
export let userName = null;

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