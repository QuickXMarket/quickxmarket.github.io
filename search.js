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

const db= getDatabase();

window.onload=function(){
    var cart_listnum=JSON.parse(localStorage.getItem("cart"))
    if(cart_listnum!==null&&cart_listnum.length!==0){
        document.getElementById("cart_num").innerHTML=cart_listnum.length
        document.getElementById("cart_num2").innerHTML=cart_listnum.length
      }else{
        document.getElementById("cart_num").innerHTML=0
        document.getElementById("cart_num2").innerHTML=0
    }
  document.getElementById("title").innerHTML=window.location.host
    var params=new URLSearchParams(window.location.search)
    var searchitem=params.get("search")
    document.getElementById("div2").value= searchitem
    const dbref=ref(db);
    get(child(dbref,"upload/")).then((snapshot)=>{
      if(snapshot.exists()){
        document.getElementById("loader").setAttribute("style", "display:none")
        var arr = snapshot.val()
        var numb=  snapshot.val()
      var lenth=Object.keys(numb).length
      var x= lenth-1
      var evnt=1
      do{
        var key= Object.keys(arr)[x]
        var value=arr[key]
        var searchvalue=value["name"]
        if(searchvalue.toLowerCase().includes(searchitem.toLowerCase())){
          const myURL= new URL(window.location.protocol+"//"+window.location.host+"/product.html")
          myURL.searchParams.append("product",value["code"])
          var anchr=document.createElement("a")
          anchr.href=myURL
            anchr.classList.add("col-sm-6", "col-lg-4", "items_view", "d-sm-inline-flex")
            var image=document.createElement("img")
            image.classList.add("item_image")
            image.src=value["url0"]
            anchr.appendChild(image)
            var detail=document.createElement("div")
            var text=document.createElement("span")
            text.classList.add("item_name")
            text.innerHTML=value["name"]
            detail.appendChild(text)
            var break_line=document.createElement("br")
            detail.appendChild(break_line)
            var price=document.createElement("span")
            price.classList.add("item_price")
            price.innerHTML="₦"+value["price"]
            detail.appendChild(price)
            anchr.appendChild(detail)
        var listview=document.getElementById("list")
        listview.appendChild(anchr)
      }
        x--
      }while(x>=0)
    }
    })
}
function sear(){
  var searchitem=document.getElementById("div2").value
  const myURL= new URL(window.location.protocol+"//"+window.location.host+"/search.html")
  myURL.searchParams.append("search",searchitem)
  window.location=myURL
}

 
  function load(view, code){
    document.getElementById(view).onclick=function() {
      const myURL= new URL(window.location.protocol+"//"+window.location.host+"/product.html")
      myURL.searchParams.append("product",code)
      window.location=myURL;
    }
  }
document.getElementById("div2").addEventListener('search', sear)
