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
var arr, numb, details=JSON.parse( localStorage.getItem("details"))
const db= getDatabase();

var list=document.createElement("form")
window.onload=function(){
  if(details===null){
    window.location="signin.html"

}else{
  get_address()
}
}

function get_address(){
  const dbref=ref(db);
  get(child(dbref,"user/")).then((snapshot)=>{
   if(snapshot.exists()){
    document.getElementById("loader").setAttribute("style", "display:none")
     arr = snapshot.val()
       numb=  snapshot.val()
      var lenth=Object.keys(numb).length
     for(var x= lenth-1; x>=0; x--){
     var key= Object.keys(arr)[x]
     var value=arr[key]
    var searchvalue=value["code"]
    if(details["user"]===searchvalue){
      for(let i=value["details"]; i>0; i--){
    var first_title=document.createElement("div")
    var last_title=document.createElement("div")
    var phone_title=document.createElement("div")
    var gender_title=document.createElement("div")
    var hostel_title=document.createElement("div")
    var first=document.createElement("div")
    var last=document.createElement("div")
    var phone=document.createElement("div")
    var gender=document.createElement("div")
    var hostel=document.createElement("div")
    var anchr= document.createElement("a")
    var input= document.createElement("input")
    var div=document.createElement("div")
    var div1=document.createElement("div")
    var div2=document.createElement("div")
    var label=document.createElement("label")

    first_title.textContent="First Name:"
    last_title.textContent="Last Name:"
    phone_title.textContent="Phone:"
    gender_title.textContent="Gender:"
    hostel_title.textContent="Hostel:"
    first.textContent=value["first"+i]
    last.textContent=value["second"+i]
    phone.textContent=value["phone"+i]
    gender.textContent=value["gender"+i]
    hostel.textContent=value["hostel"+i]
    const myURL= new URL(window.location.protocol+"//"+window.location.host+"/edit-address.html")
    myURL.searchParams.append("address",i)
    anchr.href=myURL
    anchr.textContent="Edit"

    first_title.classList.add("title")
    last_title.classList.add("title")
    phone_title.classList.add("title")
    gender_title.classList.add("title")
    hostel_title.classList.add("title")
    first.classList.add("info")
    last.classList.add("info")
    phone.classList.add("info")
    hostel.classList.add("info")
    gender.classList.add("info")
    label.classList.add("labl")
    anchr.classList.add("edit-link")
    input.type="radio"
    div.setAttribute("id", i)

    if(value["address_set"+i]==="on"){
input.checked=true;
    }else{
      input.checked=false;
    }

    div1.appendChild(anchr)
    var flex=document.createElement("div")
    flex.classList.add("flex")
    flex.appendChild(first_title)
    flex.appendChild(first)
    div.appendChild(flex)
    var flex=document.createElement("div")
    flex.classList.add("flex")
    flex.appendChild(last_title)
    flex.appendChild(last)
    div.appendChild(flex)
    var flex=document.createElement("div")
    flex.classList.add("flex")
    flex.appendChild(phone_title)
    flex.appendChild(phone)
    div.appendChild(flex)
    var flex=document.createElement("div")
    flex.classList.add("flex")
    flex.appendChild(hostel_title)
    flex.appendChild(hostel)
    div.appendChild(flex)
    var flex=document.createElement("div")
    flex.classList.add("flex")
    flex.appendChild(gender_title)
    flex.appendChild(gender)
    div.appendChild(flex)
  label.appendChild(input)
 div2.appendChild(div1)
 div2.appendChild(div)
  label.appendChild(div2)
  document.getElementById("body").appendChild(label)
  onclicked(i, value)
}

}
}
   }
}).catch((error)=>console.log(error))
}

function onclicked(num, value){
document.getElementById(num).onclick=function(e){
  e.preventDefault();
if(value['details']>1){
  if(value["address_set"+num]!=="on"){
    document.getElementById("loader").setAttribute("style", "display:block")
    document.getElementById("body").setAttribute("style", "display:none")
var addres_set= new Map
addres_set["address_set"+num]='on'
for(let i=1; i<=value["details"];i++){
  if(i!==num){
    addres_set["address_set"+i]='off'
  }
}
update(ref(db, "user/"+details['key']),addres_set)
.then(()=>{
  var new_details= new Object
  new_details={
    user: details["user"],
    key:details["key"],
    email: details["email"],
    first: value["first"+num],
    name: value["first"+num]+" "+ value["second"+num],
    hostel: value["hostel"+num],
    gender: value["gender"+num],
    phone: value["phone"+num],
    login: "yes"
  }
  localStorage.setItem("details", JSON.stringify(new_details))
 document.getElementById("body").innerHTML=""
 document.getElementById("body").setAttribute("style", "display:block")
  get_address()
})
.catch((error)=>{
 console.log(error);
});
  }
}
}
}
