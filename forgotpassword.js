import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1eIsNv6jgME94d8ptQT45JxCk2HswuyY",
  authDomain: "project-109e2.firebaseapp.com",
  databaseURL: "https://project-109e2.firebaseio.com",
  projectId: "project-109e2",
  storageBucket: "project-109e2.appspot.com",
  messagingSenderId: "994321863318",
  appId: "1:994321863318:web:10d3b180f8ff995d9ba8b7",
  measurementId: "G-Y83PD3D9Q5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import { getAuth, sendPasswordResetEmail  } 
from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";

var email;

const paymentForm = document.getElementById('boxes');
paymentForm.addEventListener("submit", submit, false); 

function submit(e){
  e.preventDefault();
  email= document.getElementById("email").value
    send_email()
    document.getElementById("loader").setAttribute("style", "display:block")
}

function send_email(){
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
      alert("Email Sent")
      window.history.back()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage=error.message;
        document.getElementById("loader").setAttribute("style", "display:none")
       alert(errorMessage)
  
      });
}
window.onload=function(){
  alert(window.innerWidth+","+window.innerHeight)
}