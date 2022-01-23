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

import{getDatabase, ref, set, get, child, update, remove}
from "https://www.gstatic.com/firebasejs/9.4.1/firebase-database.js";
var first, last, hostel, gender, phone, arr, numb, details=JSON.parse( localStorage.getItem("details"))
const db= getDatabase();

window.onload=function(){

}

const paymentForm = document.getElementById('boxes');
paymentForm.addEventListener("submit", submit, false); 


function submit(e){
  e.preventDefault();
    ready()
    if(first!==""&&last!==""&&phone!==""&&gender!=="Gender"&&hostel!=="Hostel"){
      document.getElementById("loader").setAttribute("style", "display:block")
      create_address()
}else{
    alert("Fill all Fields")
  }
}
function create_address(){
  const dbref=ref(db);
    get(child(dbref,"user/")).then((snapshot)=>{
        if(snapshot.exists()){
          arr = snapshot.val()
          numb=  snapshot.val()
         var lenth=Object.keys(numb).length
        for(var x= lenth-1; x>=0; x--){
          var key= Object.keys(arr)[x]
          var value=arr[key]
         var searchvalue=value["code"]
         if(details["user"]===searchvalue){
          var details_no=parseInt(value["details"])+1
          update(ref(db, "user/"+details["key"]),{
            ["first"+details_no]: first,
            ["second"+details_no]: last,
            ["hostel"+details_no]: hostel,
            ["phone"+details_no]: "+234"+phone,
            ["gender"+details_no]: gender,
            ["details"]:details_no
          })
          .then(()=>{
            document.getElementById("loader").setAttribute("style", "display:none")
            alert("Updated")
          })
         .catch((error)=>{
          document.getElementById("loader").setAttribute("style", "display:none")
           alert(error);
         });
         }
        }
        }
      })
  
      .catch((error)=>{
        console.log(error)
      })
}

function ready(){
    first= document.getElementById("first").value
    last= document.getElementById("last").value
    phone=document.getElementById("phone").value
    hostel=document.getElementById("hostel").value
    gender=document.getElementById("gender").value
}