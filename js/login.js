import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {

getAuth,
signInWithEmailAndPassword,
onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

const app=initializeApp(firebaseConfig);

const auth=getAuth(app);

window.login=function(){

const email=document.getElementById("email").value;

const password=document.getElementById("password").value;

signInWithEmailAndPassword(auth,email,password)

.then(()=>{

location.href="admin.html";

})

.catch(()=>{

document.getElementById("msg").innerHTML="Invalid Email or Password";

});

}

onAuthStateChanged(auth,(user)=>{

if(user){

console.log("Logged In");

}

});
