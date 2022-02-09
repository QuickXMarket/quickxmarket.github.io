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
var first, detail_no, last, hostel, gender, phone, arr, numb, details=JSON.parse( localStorage.getItem("details"))
const db= getDatabase();

window.onload=function(){
    const dbref=ref(db);
    var params=new URLSearchParams(window.location.search)
    detail_no=params.get("address")
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
            document.getElementById("first").value=value["first"+detail_no]
            document.getElementById("last").value=value["second"+detail_no]
            document.getElementById("hostel").value=value["hostel"+detail_no]
            document.getElementById("phone").value=value["phone"+detail_no]
            document.getElementById("gender").value=value["gender"+detail_no]
        }
    }
    }
  })

  .catch((error)=>{
    console.log(error)
  }) 
}

const paymentForm = document.getElementById('boxes');
paymentForm.addEventListener("submit", submit, false); 


function submit(e){
  e.preventDefault();
    ready()
    if(first!==""&&last!==""&&phone!==""&&gender!=="Gender"&&hostel!=="Hostel"){
      document.getElementById("loader").setAttribute("style", "display:block")
    edit_address()
}else{
    alert("Fill all Fields")
  }
}




function edit_address(){
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
            var details_no=detail_no
            update(ref(db, "user/"+details["key"]),{
              ["first"+details_no]: first,
              ["second"+details_no]: last,
              ["hostel"+details_no]: hostel,
              ["phone"+details_no]: phone,
              ["gender"+details_no]: gender,
            })
            .then(()=>{
              document.getElementById("loader").setAttribute("style", "display:none")
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