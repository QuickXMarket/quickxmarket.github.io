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
var first, last, hostel,code,  re_password, email, password, gender, hostel, phone;
const paymentForm = document.getElementById('boxes');
paymentForm.addEventListener("submit", submit, false); 
var datakey="-M"


function submit(e){
  e.preventDefault();
   Ready()
   if(first!==""&&last!==""&&email!==""&&password!==""&&phone!==""&&gender!=="Gender"&&hostel!=="Hostel"){
    if(password===re_password){
        get_data()
    document.getElementById("loader").setAttribute("style", "display:block")
    }  else{
        alert("Password does not Match")
    }  
}else{
      alert("Fill all Fields")
    }
}

function get_data(){
  const dbref=ref(db);
    get(child(dbref,"user/")).then((snapshot)=>{
      if(snapshot.exists()){
          var arr = snapshot.val()
          var numb=  snapshot.val()
        var lenth=Object.keys(numb).length
       if(lenth>0){ 
          var x= lenth-1
          var key= Object.keys(arr)[x]
          var value=arr[key]
          var codeup= value["code"]
    for(let i=x-1; i>=0;i--){
      var key= Object.keys(arr)[i]
      var value=arr[key]
      var codesearch= value["code"]
      if(codesearch>codeup){
        codeup=codesearch
      }
   }
   code=parseInt(codeup)+1
      }else{
           code=100001
      }
     sign_up()
      
  }else{
    code=100001
  
 sign_up()
  }
    })
    .catch((error)=>get_data())
}

function sign_up(){
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      InsertData(user)
    })
    .catch((error) => {
      alert(error)
      document.getElementById("loader").setAttribute("style", "display:none")
    });
}

function Ready(){
    first= document.getElementById("first").value;
    last= document.getElementById("last").value;
   email= document.getElementById("email").value;
   password= document.getElementById("password").value;
   re_password= document.getElementById("re-password").value;
   phone= document.getElementById("phone").value;
  gender= document.getElementById("gender").value;
  hostel= document.getElementById("hostel").value;
}
function InsertData(user){
  for(let i=0; i<19; i++){
    datakey=datakey+generateRandomLetter()
  }
  set(ref(db, 'user/'+datakey),{
    code:code,
    first1: first,
    second1: last,
    email:email,
    hostel1: hostel,
    gender1: gender,
    phone1:"+234"+phone,
    key: datakey,
    address_set1: "on",
    details: 1
  })
  .then(()=>{
 cart_upload()
  })
  .catch((error)=>{
  console.log(error)
  }) 
}

function set_info(){
  var details= new Object
  details={
    user: code,
    key: datakey,
    email: email,
    first: first,
    name: first+" "+ last,
    hostel: hostel,
    gender: gender,
    phone: phone,
    login: "yes"
  }
  localStorage.setItem("details", JSON.stringify(details))
  window.location="index.html"
}

function cart_upload(){
  var cart_list=JSON.parse(localStorage.getItem("cart"))
 
  if(cart_list!==null&&cart_list.length!==0){
    var cart_length=cart_list.length;
    var cart_details=new Object
    cart_details["cart_num"]=cart_length
    for(let i=1;i<=cart_length; i++ ){
      var position=i-1
      cart_details['cart_code_'+i]=cart_list[position]["code"]
      cart_details['cart_num_'+i]=cart_list[position]["number"]
    }
    update(ref(db, "user/"+datakey),cart_details)
    .then(()=>{
     set_info()
    })
   .catch((error)=>{
    cart_upload()
   });
   
  }else{
  set_info()
  }
}

var toogle=document.getElementById("toogle")
toogle.onclick=function(){
    var x = document.getElementById("password");
var r=document.getElementById("re-password");
if (x.type === "password") {
  x.type = "text";
  r.type = "text";
  toogle.src="images/ic_visibility_black.png"
} else {
  x.type = "password";
  r.type = "password";
  toogle.src="images/ic_visibility_off_black.png"
}
}
function generateRandomLetter() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

  return alphabet[Math.floor(Math.random() * alphabet.length)]
}