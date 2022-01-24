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
import { getAuth,signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";

const db= getDatabase();
var  email, password, arr,x, key, value, numb, lenth;
var info= new Object
const paymentForm = document.getElementById('boxes');
paymentForm.addEventListener("submit", submit, false); 

function submit(e){
  e.preventDefault();
   Ready()
    sign_in()
    document.getElementById("loader").setAttribute("style", "display:block")
}


function get_data(){
  const dbref=ref(db);
  get(child(dbref,"user/")).then((snapshot)=>{
   if(snapshot.exists()){
       arr = snapshot.val()
        numb=  snapshot.val()
      lenth=Object.keys(numb).length
      x= lenth-1
     var evnt=1
     do{
        key= Object.keys(arr)[x]
        value=arr[key]
       var searchvalue=value["email"]
       if(email===searchvalue){
    for(let i=value["details"]; i>0; i--){
      if(value["address_set"+i]==="on"){
     info={
       user: value["code"],
       email:value["email"],
       first:value["first"+i],
       name:value["first"+i]+" "+value["second"+i],
       hostel:value["hostel"+i],
       gender:value["gender"+i],
       phone:value["phone"+i],
       login: "yes",
       key: value["key"]
     }
     cart_upload(value)
    }
    }
   }
   x--
   }while(x>=0)
   localStorage.setItem("details", JSON.stringify(info) )
   
   }
 
}).catch((error)=>{
  if(error!=="Error: Error: Client is offline."){
    console.log(error)
  }else{
    alert("Please Check Your Network Connection")
    document.getElementById("loader").setAttribute("style", "display:none")
  }
})
}

function Ready(){
    email= document.getElementById("email").value;
    password= document.getElementById("password").value;
}
function sign_in(){
  document.getElementById("loader").setAttribute("style", "display:block");
  if(email!==""&&password!==""){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          
          const user = userCredential.user;
          // ...
        get_data()
        })
        .catch((error) => {
          alert(error)
          document.getElementById("loader").setAttribute("style", "display:none")
        });
  }
}

function cart_upload(cart_value){
  var cart_list=JSON.parse(localStorage.getItem("cart"))
  if(cart_list!==null&&cart_list.length!==0){
  var cnum
  
    if(cart_value.hasOwnProperty("cart_num")){
      cnum= cart_value["cart_num"]
    }else{
      cnum=1
    }
    var cart_length=cart_list.length;
    var cart_details=new Object
    cart_details["cart_num"]=cart_length
    for(let i=cnum;i<=cart_length; i++ ){
      var position=i-1
      cart_details['cart_code_'+cnum]=cart_list[position]["code"]
      cart_details['cart_num_'+cnum]=cart_list[position]["number"]
    cnum++
    }
    update(ref(db, "user/"+value["key"]),cart_details)
    .then(()=>{
    cart_load(cart_value)
    })
    .catch((error)=>{
    console.log(error)
    }) 
  }else{
    cart_load(cart_value)
  }
}

function cart_load(cart_value){
  const dbref=ref(db);
  get(child(dbref,"user/")).then((snapshot)=>{
   if(snapshot.exists()){
       arr = snapshot.val()
        numb=  snapshot.val()
      lenth=Object.keys(numb).length
      
      for(let x=lenth-1; x>=0; x--){
      key= Object.keys(arr)[x]
      value=arr[key]
     var searchvalue=value["email"]
     if(email===searchvalue){
  if(value.hasOwnProperty("cart_num")){
   var new_cart= new Array
   var cnum= value["cart_num"]
   for(let i=1; i<=cnum; i++){
     new_cart.push({
      code:value["cart_code_"+i],
      number:value["cart_num_"+i]
     })
    }
   localStorage.setItem("cart", JSON.stringify(new_cart))
   window.location="index.html"
  }else{
    
  }
}
}
  }
}).catch((error)=>console.log(error))
}

var toogle=document.getElementById("toogle")
toogle.onclick=function(){
    var x = document.getElementById("password");
if (x.type === "password") {
  x.type = "text";
  toogle.src="images/ic_visibility_black.png"
} else {
  x.type = "password";
  toogle.src="images/ic_visibility_off_black.png"
}}