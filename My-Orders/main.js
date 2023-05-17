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
var details = JSON.parse(localStorage.getItem('details'));
const db = getDatabase();

window.onload = function () {
  if (details === null) {
    window.location.replace('../Login');
  } else {
    get_orders();
  }
};

function get_orders() {
  const dbref = ref(db);
  get(child(dbref, 'UsersDetails/'))
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
          if (details['user'] === searchvalue) {
            if (value.hasOwnProperty('orders')) {
              document
                .getElementById('loader')
                .setAttribute('style', 'display:none');
              document
                .getElementById('body')
                .setAttribute('style', 'display:block');
              var order_num = value['orders'];
              for (let i = order_num; i > 0; i--) {
                var num = i--;
                var ord = 'o' + num;
                var view = document.createElement('div');
                var text = document.createElement('div');
                var order_no = document.createElement('div');
                var date = document.createElement('div');
                var status = document.createElement('div');
                var price = document.createElement('div');
                var img = document.createElement('img');
                var div = document.createElement('div');

                view.classList.add('order_view');
                text.classList.add('order_txt');
                order_no.classList.add('order_no');
                img.classList.add('order_img');
                date.classList.add('order_date');
                status.classList.add('order_status');
                price.classList.add('order_price');

                var internationalNumberFormat = new Intl.NumberFormat('en-US');
                text.textContent = 'Order';
                order_no.textContent = value[ord + 'order'];
                img.src = 'cart.png';
                date.textContent = value[ord + 'date'];
                status.textContent = value[ord + 'status'];
                price.textContent =
                  '₦' + internationalNumberFormat.format(value[ord + 'total']);

                var flex = document.createElement('div');
                flex.classList.add('flex');
                flex.appendChild(text);
                flex.appendChild(order_no);
                view.appendChild(flex);

                var flex = document.createElement('div');
                flex.classList.add('flex');
                div.appendChild(img);
                div.appendChild(price);
                flex.appendChild(div);
                flex.appendChild(status);
                view.appendChild(flex);

                view.appendChild(date);

                var body = document.getElementById('body');
                body.appendChild(view);
              }
            } else {
              document
                .getElementById('body')
                .setAttribute('style', 'display:block');
              document
                .getElementById('no_items')
                .setAttribute('style', 'display:block');
              document
                .getElementById('loader')
                .setAttribute('style', 'display:none');
            }
          }
          x--;
        } while (x >= 0);
      }
    })
    .catch((error) => console.log(error));
}
