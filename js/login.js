import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Login
window.login = async function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        document.getElementById("msg").innerHTML =
        "Email और Password भरें";
        return;
    }

    try {

        await signInWithEmailAndPassword(auth, email, password);

        window.location.href = "admin.html";

    } catch (error) {

        document.getElementById("msg").innerHTML = error.message;

    }

};

// Check Login
onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log("Login Success:", user.email);

    }

});
