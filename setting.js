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
import { getAuth,signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
window.onload=function(){
  var cart_listnum=JSON.parse(localStorage.getItem("cart"))
  if(cart_listnum!==null&&cart_listnum.length!==0){
    document.getElementById("cart_num").innerHTML=cart_listnum.length
  }else{
    document.getElementById("cart_num").innerHTML=0}
var details=JSON.parse( localStorage.getItem("details"))
if(details!==null){
  document.getElementById("login").innerHTML="Logout"
  document.getElementById("loginrequest").innerHTML=details["email"]
  document.getElementById("username").innerHTML=details["first"]
}
if(document.getElementById("login").innerHTML==="Login"){
  var anchr= document.createElement("a")
anchr.href="signin.html"
anchr.appendChild(document.getElementById("login"))
document.getElementById("div3").appendChild(anchr)
}
}
document.getElementById("login").onclick=function(){
  if(document.getElementById("login").innerHTML==="Login"){

}
else{
  const auth = getAuth();
  signOut(auth).then(() => {
    // Sign-out successful.
    document.getElementById("login").innerHTML="Login"
  document.getElementById("loginrequest").innerHTML="Please Login to your Account"
  document.getElementById("username").innerHTML=""
    localStorage.removeItem("details")
    var anchr= document.createElement("a")
    anchr.href="signin.html"
anchr.appendChild(document.getElementById("login"))
document.getElementById("div3").appendChild(anchr)
  }).catch((error) => {
    // An error happened.
    alert(error)
  });
 
}
}