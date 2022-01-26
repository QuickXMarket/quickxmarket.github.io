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
var cart_item=new Array;
const db= getDatabase();
var add=document.getElementById("plus-box")
var minus=document.getElementById("minus-box")
var cart =document.getElementById("add-box")
var avail="no"
var new_list=new Array
var newcart_item=new Array;
var recent_list=new Array
var cn, lenth, item_code, key, cart_num, value, arr;
window.onload=function(){
  var cart_listnum=JSON.parse(localStorage.getItem("cart"))
 
if(cart_listnum!==null&&cart_listnum.length!==0){
    document.getElementById("cart_num").innerHTML=cart_listnum.length
    document.getElementById("cart_num2").innerHTML=cart_listnum.length
  }else{
    document.getElementById("cart_num").innerHTML=0
    document.getElementById("cart_num2").innerHTML=0
}
  onopen()
 }
function onopen(){
  var params=new URLSearchParams(window.location.search)
  var searchitem=params.get("product")
 if(searchitem===null) {
  window.location="index.html"
  }else{
    const dbref=ref(db);
  get(child(dbref,"upload/")).then((snapshot)=>{
    if(snapshot.exists()){
      document.getElementById("loader").setAttribute("style", "display:none")
      document.getElementById("body").setAttribute("style", "display:block")
       arr = snapshot.val()
      var numb=  snapshot.val()
    lenth=Object.keys(numb).length
    save_recent(searchitem)
    show_recent()
     var x= lenth-1
   
    do{
      var key= Object.keys(arr)[x]
      value=arr[key]
      var searchvalue=value["code"]
      if(searchvalue===searchitem){
        document.getElementById("title").innerHTML=value["name"]
          document.getElementById("item_name").innerHTML=value["name"]
          document.getElementById("item_price").innerHTML="₦"+value["price"]
          document.getElementById("item_description").innerHTML=value["description"]
          document.getElementById("1").src=value["url0"]
          var urln=1
          var urlx=value["num"]
          item_code=value["code"]
          var retrieve=localStorage.getItem("cart")
          cart_item=JSON.parse(retrieve)
         get_cart(searchitem)
          do{
            var cont= document.createElement("div")
            cont.classList.add("img_container")
            var slide=document.createElement("div")
            slide.classList.add("carousel-item")
            var main=document.getElementById("slidercontainer")
            var image= document.createElement("img")
            image.classList.add("item_images","d-block","w-100")
            image.src=value["url"+urln]
            cont.appendChild(image)
            slide.appendChild(cont)
            main.appendChild(slide)
            urln++
          }while(urln>urlx)
    }
      x--
    }while(x>=0)
  }
  var i=0;
  
      document.getElementById("loader").setAttribute("style", "display:none")
       arr = snapshot.val()
     lenth=Object.keys(arr).length
    lenth--
    
    do{
      var p=i
      i++
      sett(i)
    }while(i<6) 
  
  })
  .catch((error)=>{
   console.log(error)
   
  })
}
}

var pos;

  function get_cart(code){
      
    var cartn=0
  add.style.display="none"
  minus.style.display="none"
  avail="no"
  if(cart_item!==null){
  var cart_length=cart_item.length
  newcart_item=cart_item
  
  do{
    if(code==cart_item[cartn]["code"]){
      avail="yes"
      cart.innerHTML=cart_item[cartn]["number"]
      cart.setAttribute("style", "box-shadow:none")
      cart.style.backgroundColor="white"
      cart.style.color="black"
      add.style.display="flex"
  minus.style.display="flex"
  cart_num=cart_item[cartn].number
  cn=cartn
    }
    cartn++
  }while(cartn<cart_length)
}
}

cart.onclick=function(){
if(avail==="no"){
  add.style.display="flex"
  minus.style.display="flex"
  avail="yes"
  cart.style.backgroundColor="white"
  cart.style.color="black"
  cart.style.boxShadow="none"
  newcart_item.push({
    code:item_code,
    number:1
 })
    cart.innerHTML=1
    cart_num=1 
    localStorage.setItem("cart", JSON.stringify(newcart_item)) 
    cn=newcart_item.length-1
    var cart_listnum=JSON.parse(localStorage.getItem("cart"))
 
if(cart_listnum!==null&&cart_listnum.length!==0){
    document.getElementById("cart_num").innerHTML=cart_listnum.length
    document.getElementById("cart_num2").innerHTML=cart_listnum.length
  }else{
    document.getElementById("cart_num").innerHTML=0
    document.getElementById("cart_num2").innerHTML=0
}
  }
};

add.onclick=function(){
  cart_num++
  cart.innerHTML=cart_num
 newcart_item[cn].number=cart_num
  localStorage.setItem("cart", JSON.stringify(newcart_item)) 
};
minus.onclick=function(){
  cart_num--
  if(cart_num===0){
    cart.setAttribute("style", "  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);    ")
    cart_item.splice(cn, 1)
    add.style.display="none"
  minus.style.display="none"
  avail="no"
  cart.style.backgroundColor="#000137"
  cart.style.color="white"
  cart.innerHTML="Add to cart"
  newcart_item.splice(cn, 1)
  localStorage.setItem("cart", JSON.stringify(newcart_item)) 
  var cart_listnum=JSON.parse(localStorage.getItem("cart"))
 
if(cart_listnum!==null&&cart_listnum.length!==0){
    document.getElementById("cart_num").innerHTML=cart_listnum.length
    document.getElementById("cart_num2").innerHTML=cart_listnum.length
  }else{
    document.getElementById("cart_num").innerHTML=0
    document.getElementById("cart_num2").innerHTML=0
}
}else{
    cart.innerHTML=cart_num
    newcart_item[cn].number=cart_num
   localStorage.setItem("cart", JSON.stringify(newcart_item)) 
  }
};

 function load(view, code){
  document.getElementById(view).onclick=function() {
    const myURL= new URL(window.location.protocol+"//"+window.location.host+"/product.html")
    myURL.searchParams.append("product",code)
    window.location=myURL;
  }
}
function sett(n){
   var x= Math.floor(Math.random()*lenth)+0
    var key= Object.keys(arr)[x]
     value=arr[key]
    const myURL= new URL(window.location.protocol+"//"+window.location.host+"/product.html")
     myURL.searchParams.append("product",value["code"])
     var anchr=document.createElement("a")
     anchr.href=myURL
     anchr.classList.add("items_view","col-xs-6","col-sm-4", "col-lg-3", "col-md-4", "col-xs-6" )
     var image=document.createElement("img")
     image.classList.add("items_image")
     image.src=value["url0"]
     anchr.appendChild(image)
    var name=document.createElement("p")
    name.classList.add("item_name")
    name.innerHTML=value["name"]
  name.setAttribute('style', 'color:#000000')
    anchr.appendChild(name)
    var price=document.createElement("p")
    price.classList.add("item_price")
    price.innerHTML="₦"+value["price"]
    price.setAttribute('style', 'color:#000137')
    anchr.appendChild(price)
    var body=document.getElementById("recom")
    body.append(anchr)
}

function save_recent(code){
  recent_list=JSON.parse( localStorage.getItem("recent"))
  if(recent_list===null){
    new_list.push({
     ["code"]:code,
   })
      localStorage.setItem("recent", JSON.stringify(new_list)) 
  }else{
    var recent_length=recent_list.length
    new_list=recent_list
    for(let i=0; i<recent_length; i++){
      if(code===recent_list[i]["code"]){
        previous(i, code)
        return
      }
    }
    if(recent_length!==10){
      new_list.push({
        ["code"]:code,
      })
         localStorage.setItem("recent", JSON.stringify(new_list)) 
    }else{
      for(let i=0; i<10; i++){
        recent_list[i]=recent_list[i+1]
      }
      new_list.push({
        ["code"]:code,
      })
         localStorage.setItem("recent", JSON.stringify(new_list)) 
    }
  }
}

function show_recent(){
  recent_list=JSON.parse(localStorage.getItem("recent"))

 if(recent_list!==null){
   var recent_length=recent_list.length
  for(let i=recent_length-1; i>=0; i--){
    for(let x=0; x<lenth; x++){
     var key= Object.keys(arr)[x]
     value=arr[key]
     var code=recent_list[i]["code"]
     var searchvalue=value["code"]
     if(searchvalue===code){
    const myURL= new URL(window.location.protocol+"//"+window.location.host+"/product.html")
     myURL.searchParams.append("product",value["code"])
     var anchr=document.createElement("a")
     anchr.href=myURL
     anchr.classList.add("rec_view" )
     var image=document.createElement("img")
     image.classList.add("rec_image")
     image.src=value["url0"]
     anchr.appendChild(image)
    var price=document.createElement("p")
    price.classList.add("rec_price")
    price.innerHTML="₦"+value["price"]
    price.setAttribute('style', 'color:#000137')
    anchr.appendChild(price)
    var body=document.getElementById("recent")
    body.append(anchr)
  }
  }
  }
}else{
  document.getElementById("rec").setAttribute("style","display:none")
}
}

function previous(n, code){
  var recent_length=recent_list.length-1
  for(let i=n; i<recent_length; i++){
    recent_list[i]=recent_list[i+1]
  }
  var prev={
    ["code"]:code,
  }
  new_list[recent_length]=prev
     localStorage.setItem("recent", JSON.stringify(new_list))
}