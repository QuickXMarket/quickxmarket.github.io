import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-analytics.js';

const firebaseConfig = {
  apiKey: 'AIzaSyA1eIsNv6jgME94d8ptQT45JxCk2HswuyY',
  authDomain: 'project-109e2.firebaseapp.com',
  databaseURL: 'https://project-109e2.firebaseio.com',
  projectId: 'project-109e2',
  storageBucket: 'project-109e2.appspot.com',
  messagingSenderId: '994321863318',
  appId: '1:994321863318:web:10d3b180f8ff995d9ba8b7',
  measurementId: 'G-Y83PD3D9Q5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  remove,
} from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-database.js';
var cart_item = new Array();
const db = getDatabase();

window.onload = function () {
  var cart_listnum = JSON.parse(localStorage.getItem('cart'));

  if (cart_listnum !== null && cart_listnum.length !== 0) {
    document.getElementById('cart_num').innerHTML = cart_listnum.length;
    document.getElementById('cart_num2').innerHTML = cart_listnum.length;
  } else {
    document.getElementById('cart_num').innerHTML = 0;
    document.getElementById('cart_num2').innerHTML = 0;
  }
  onopen();
};
function onopen() {
  var params = new URLSearchParams(window.location.search);
  var searchitem = params.get('product');
  if (searchitem === null) {
    window.location.replace('../');
  } else {
    const dbref = ref(db);
    get(child(dbref, 'ProductsDetails/'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          var arr = snapshot.val();
          var numb = snapshot.val();
          var lenth = Object.keys(numb).length;
          var x = lenth - 1;

          do {
            var key = Object.keys(arr)[x];
            var value = arr[key];
            var searchvalue = value['code'];
            if (searchvalue === searchitem) {
              document.getElementById('description').innerHTML =
                value['description'];
            }
            x--;
          } while (x >= 0);
        }
        if (document.getElementById('description').innerHTML !== '') {
          document
            .getElementById('loader')
            .setAttribute('style', 'display:none');
          document
            .getElementById('body')
            .setAttribute('style', 'display:block');
        } else {
          document
            .getElementById('loader')
            .setAttribute('style', 'display:none');
          document
            .getElementById('no_items')
            .setAttribute('style', 'display:block');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
