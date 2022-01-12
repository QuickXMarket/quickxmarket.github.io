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
var newcart_item=new Array;
var cart_list=new Array

var length, item_name,item_price,item_image,item_num, cn, item_code, key, cart_number;
var price=0

window.onload=function(){
 get_values()
}

function get_values(){
  document.getElementById("cart_body").style.display = "none";
  document.getElementById("cart").style.display = "none"; 
  document.getElementById("loader").style.display = "block"; 
  cart_list=JSON.parse(localStorage.getItem("cart"))
 
  if(cart_list!==null&&cart_list.length!==0){
      const dbref=ref(db);
      get(child(dbref,"upload/")).then((snapshot)=>{
        if(snapshot.exists()){
          length=cart_list.length-1
          var evet=1
          document.getElementById("loader").style.display = "none";
          document.getElementById("cart_body").style.display = "block";
          document.getElementById("cart").style.display = "block";  
         document.getElementById("cart").textContent=""
          newcart_item=JSON.parse(localStorage.getItem("cart"))
        do{
          var arr = snapshot.val()
          var numb=  snapshot.val()
        var lenth=Object.keys(numb).length
        var x= 0
        do{
          var cartcode= cart_list[length]["code"]
          var key= Object.keys(arr)[x]
          var value=arr[key]
          var searchvalue=value["code"]
          if(cartcode===searchvalue){
              item_num=cart_list[length]["number"]
              item_price=value["price"]
              item_name=value["name"]
              item_image=value["url0"]
             var item_code=value["code"]
             price+=parseInt(item_price)*parseInt(item_num)
              createlist(evet, item_code)
              evet++
              cn=length
              
          }
         x++
        }while(x<lenth)
        length--
      }while(length>=0)
        }
        document.getElementById("total").innerHTML="₦"+price
      })
     .catch((error)=>get_values())
}else{
  document.getElementById("loader").style.display = "none";
  document.getElementById("cart_body").style.display = "block";
  document.getElementById("info").style.display = "none";
  document.getElementById("no_items").style.display = "block";  
 
}
}

function createlist(num, code){
    var cart=document.getElementById("cart")
    var image=document.createElement("img")
    var view= document.createElement("div")
   var name=document.createElement("p")
   var price=document.createElement("p")
   var add= document.createElement("img")
   var minus=document.createElement("img")
   var remove_img= document.createElement("img")
  var cart_num=document.createElement("p")
  var remove_text=document.createElement("p")
  var remove= document.createElement("div")
  var controls= document.createElement("div")
  var anchr=document.createElement("a");
   
    view.classList.add("cart-view")
    image.classList.add("item-image")
    name.classList.add("item-name")
    price.classList.add("item-price")
    controls.classList.add("controls")
    remove.setAttribute("id", "remove"+num)
    controls.classList.add("flex")
    remove.classList.add("remove")
    add.setAttribute("id", "add"+num)
    minus.setAttribute("id", "minus"+num)
    cart_num.setAttribute("id","cartnum"+num)

    const myURL= new URL(window.location.protocol+"//"+window.location.host+"/product.html")
    myURL.searchParams.append("product",code)
    anchr.href=myURL
    remove_text.innerHTML="Remove"
    remove_img.src="images/ic_delete_black.png"
    add.src="images/ic_add_circle_black.png"
    minus.src="images/ic_remove_circle_black.png"
    image.src=item_image
    name.innerHTML=item_name
    price.innerHTML="₦"+item_price
    cart_num.innerHTML=item_num


    var flex= document.createElement("div")
    var div= document.createElement("div")
    div.style.padding="8px"
    flex.classList.add("flex")
    flex.setAttribute("id", "cart-view"+num)
    div.appendChild(name)
    div.appendChild(price)
    flex.appendChild(image)
    flex.appendChild(div)
    anchr.appendChild(flex)
    view.appendChild(anchr)

    var flex= document.createElement("div")
    flex.classList.add("flex")
    remove.appendChild(remove_img)
    remove.appendChild(remove_text)
    controls.appendChild(remove)
    controls.appendChild(flex)
    controls.appendChild(minus)
    controls.appendChild(cart_num)
    controls.appendChild(add)
    view.appendChild(controls)
    
    cart.appendChild(view)
    add_cart("add"+num, "cartnum"+num, code)
    minus_cart("minus"+num, "cartnum"+num, code)
    remove_cart("remove"+num,code)
    load("cart-view"+num, code)
}

function add_cart(view, cartn, code){
  document.getElementById(view).onclick=function(){
  cart_number=parseInt(document.getElementById(cartn).innerHTML)+1
  document.getElementById(cartn).innerHTML=cart_number
 newcart_item[cn].number=cart_number
  localStorage.setItem("cart", JSON.stringify(newcart_item))
}
}

function minus_cart(view, cartn, code){
  document.getElementById(view).onclick=function(){
    cart_number=parseInt(document.getElementById(cartn).innerHTML)-1
    document.getElementById(cartn).innerHTML=cart_number
    if(cart_number==0){
      newcart_item.splice(cn, 1)
      localStorage.setItem("cart", JSON.stringify(newcart_item))
      get_values()
    }else{
      newcart_item[cn].number=cart_number
      localStorage.setItem("cart", JSON.stringify(newcart_item))
    }
  }
}

function remove_cart(view, code){
  document.getElementById(view).onclick=function(){
  newcart_item.splice(cn, 1)
  localStorage.setItem("cart", JSON.stringify(newcart_item))
  get_values()
  }
}
function load(view, code){
  document.getElementById(view).onclick=function() {
    const myURL= new URL(window.location.protocol+"//"+window.location.host+"/product.html")
    myURL.searchParams.append("product",code)
    window.location=myURL;
  }
}