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

let saved_items,item_image,item_name,item_price, arr, lenth, value;
let cart_items=JSON.parse(localStorage.getItem("cart"));
var internationalNumberFormat = new Intl.NumberFormat('en-US')

window.onload=function(){
   Get_SavedItems()
}

function Create_Element(num, code,len){
    document.getElementById("loader").style.display = "none";
    document.getElementById("page_body").style.display = "block";
    document.getElementById("item_list").style.display = "block";  

    var cart=document.getElementById("item_list")
    var image=document.createElement("img")
    var view= document.createElement("div")
   var name=document.createElement("p")
   var price=document.createElement("p")
  var add=document.createElement("button")
   var remove_img= document.createElement("img")
  var remove_text=document.createElement("p")
  var remove= document.createElement("div")
  var controls= document.createElement("div")
  var anchr=document.createElement("a");
   
    view.classList.add("item-view")
    image.classList.add("item-image")
    name.classList.add("item-name")
    price.classList.add("item-price")
    controls.classList.add("controls")
    remove.setAttribute("id", "remove"+num)
    controls.classList.add("flex")
    remove.classList.add("remove")
    add.setAttribute("id", "add"+num)

    const myURL= new URL(window.location.protocol+"//"+window.location.host+"/product.html")
    myURL.searchParams.append("product",code)
    anchr.href=myURL
    remove_text.textContent="Remove"
    remove_img.src="images/ic_delete_black.png"
    add.innerText="Add to Cart"
    image.src=item_image
    name.textContent=item_name
    price.textContent="₦"+internationalNumberFormat.format(item_price)


    var flex= document.createElement("div")
    var div= document.createElement("div")
    div.style.padding="8px"
    flex.classList.add("flex")
    flex.setAttribute("id", "item-view"+num)
    div.appendChild(name)
    div.appendChild(price)
    flex.appendChild(image)
    flex.appendChild(div)
    anchr.appendChild(flex)
    view.appendChild(anchr)

    var flex= document.createElement("div")
    var div= document.createElement("div")
    flex.classList.add("flex")
    remove.appendChild(remove_img)
    remove.appendChild(remove_text)
    controls.appendChild(remove)
    controls.appendChild(flex)
    div.appendChild(add)
    controls.appendChild(div)
    view.appendChild(controls)
    
    cart.appendChild(view)
    add_cart("add"+num,code)
    remove_favorite("remove"+num,code, len)
}

function Get_SavedItems(){
  document.getElementById("page_body").style.display = "none";
  document.getElementById("item_list").style.display = "none"; 
  document.getElementById("loader").style.display = "block"; 
  saved_items=JSON.parse(localStorage.getItem("saved_items"));
 
  if(saved_items!==null&&saved_items.length!==0){
      const dbref=ref(db);
      get(child(dbref,"upload/")).then((snapshot)=>{
        if(snapshot.exists()){
         
          var evet=1
          document.getElementById("loader").style.display = "none";
          document.getElementById("page_body").style.display = "block";
          document.getElementById("item_list").style.display = "block";  
         document.getElementById("item_list").textContent=""
        for(let l=saved_items.length-1;l>=0;l--){
         arr = snapshot.val()
          var numb=  snapshot.val()
         lenth=Object.keys(numb).length
        
        for(var x= 0;x<lenth; x++){
          var itemcode=saved_items[l]["code"]
          var key= Object.keys(arr)[x]
       value=arr[key]
          var searchvalue=value["code"]
          if(itemcode===searchvalue){
              item_price=value["price"]
              item_name=value["name"]
              item_image=value["url0"]
             var item_code=value["code"]
              Create_Element(evet, item_code, l)
              evet++
          }
        }
      }
        }
     show_recent()
      })
     .catch((error)=>console.log(error))
}else{
  document.getElementById("loader").style.display = "none";
  document.getElementById("page_body").style.display = "block";
  document.getElementById("no_items").style.display = "block";  
 
}
}

function add_cart(view,code,len){
    document.getElementById(view).onclick=function(){
      var newcart_item=new Array
     if(cart_items!==null){
       cart_items.push({
        code:code,
        number:1
     });
     localStorage.setItem("cart", JSON.stringify(cart_items))
    }else{
      newcart_item.push({
        code:code,
        number:1
     });
     localStorage.setItem("cart", JSON.stringify(newcart_item))
    } 
    saved_items.splice(len, 1)
    localStorage.setItem("saved_items", JSON.stringify(saved_items))
    Get_SavedItems()
  }
  }
  

  
  function remove_favorite(view, len){
    document.getElementById(view).onclick=function(){
    saved_items.splice(len, 1)
    localStorage.setItem("saved_items", JSON.stringify(saved_items))
    Get_SavedItems()
    }
  }
  function load(view, code){
    document.getElementById(view).onclick=function() {
      const myURL= new URL(window.location.protocol+"//"+window.location.host+"/product.html")
      myURL.searchParams.append("product",code)
      window.location=myURL;
    }
  }
  
  
  
  function show_recent(){
   var recent_list=JSON.parse(localStorage.getItem("recent"))
  
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
      price.textContent="₦"+internationalNumberFormat.format(value["price"])
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
  
  