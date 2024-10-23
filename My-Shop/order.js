import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-analytics.js';

const firebaseConfig = {
  apiKey: "AIzaSyBYxeN5MYVPDLNO2rmAd4ac1Bm3CzJhcpM",
  authDomain: "quickmarkert.firebaseapp.com",
  databaseURL: "https://quickmarkert-default-rtdb.firebaseio.com",
  projectId: "quickmarkert",
  storageBucket: "quickmarkert.appspot.com",
  messagingSenderId: "204278904584",
  appId: "1:204278904584:web:9000c97e001e7104a4debd",
  measurementId: "G-VKQ30K962R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import {
  getDatabase,
  get,
  set,
  update,
  child,
  ref as dref,
} from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-database.js';

var internationalNumberFormat = new Intl.NumberFormat('en-US');

Object.values(document.getElementsByClassName('option_view')).forEach(
  (element, index) => {
    element.addEventListener('click', () => {
      Object.values(document.getElementsByClassName('option_select')).forEach(
        (select) => (select.style.backgroundColor = '#000137')
      );
      document.getElementsByClassName('option_select')[
        index
      ].style.backgroundColor = 'white';

      switch (index) {
        case 0:
          if (
            !document.getElementById('itemList').classList.contains('visible')
          ) {
            document.getElementById('itemList').classList.toggle('visible');
            document.getElementById('orderList').classList.toggle('visible');
          }
          break;
        case 1:
          if (
            !document.getElementById('orderList').classList.contains('visible')
          ) {
            document.getElementById('itemList').classList.toggle('visible');
            document.getElementById('orderList').classList.toggle('visible');
          }
          break;
      }
    });
  }
);

export function getVendorOrders(vendorDetails) {
  if (vendorDetails['Orders'] === undefined) return;
  const vendorOrders = Object.values(vendorDetails['Orders']);
  if (vendorOrders.length > 0) {
    vendorOrders.forEach((order) => {
      document.getElementById('orderList').innerHTML += `
       <div class="order_view">
              <div class="flex">
                <div class="order_txt">Order</div>
                <div class="order_no">${order['order']}</div>
              </div>

              <div class="flex">
                <div>
                  <img class="order_img" src="cart.png" />
                </div>
                <div class="orderInfo">
                  <div class="orderName">${order['name']}</div>
                  <div class="orderHostel">${order['hostel']}</div>
                </div>
              </div>
              <div class="flex">
                <div class="order_price">${
                  '₦' + internationalNumberFormat.format(order['total'])
                }</div>
                <div class="order_status">
                  <button class="statusBtn">${
                    order['status'] === 'Confirming Request'
                      ? 'Confirm Request'
                      : 'Confirm Delivery'
                  }</button>
                </div>
              </div>
              <div class="order_date">${order['date']}</div>
            </div>`;
    });
    Object.values(document.getElementsByClassName('statusBtn')).forEach(
      (element) => {
        element.addEventListener('click', (e) => {
          e.preventDefault();
          const status = e.target.innerText;
          switch (status) {
            case 'Confirm Request':
              alert('working');
          }
        });
      }
    );
  }
}

function changeUserOrderStatus(newStatus, orderDetails) {
  get(child(dbref, 'UsersDetails/'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        var userList = snapshot.val();
        var listLength = Object.values(userList).length;
        for (let i = 0; i < listLength; i++) {
          const userDetails = Object.values(userList)[i];
          if (userDetails['code'] === orderDetails['user']) {
            const orders = userDetails['Orders'];

            Object.values(orders).forEach((order, index) => {
              if (order['order'] === orderDetails['order']) {
                var newOrderDetails = {
                  Orders: {
                    ['Order' + index + 1]: {
                      status: newStatus,
                    },
                  },
                };
                update(
                  ref(db, 'UsersDetails/' + userDetails['key']),
                  newOrderDetails
                )
                  .then(() => {
                    changeVendorOrderStatus();
                  })
                  .catch((error) => console.log(error));
              }
            });
          }
        }
      }
    })
    .catch((error) => console.log(error));
}

function changeVendorOrderStatus(newStatus, orderDetails, vendorDetails) {
  const orders = vendorDetails['Orders'];

  Object.values(orders).forEach((order, index) => {
    if (order['order'] === orderDetails['order']) {
      var newOrderDetails = {
        Orders: {
          ['Order' + index + 1]: {
            status: newStatus,
          },
        },
      };
      update(ref(db, 'Vendor/' + vendorDetails['key']), newOrderDetails)
        .then(() => {
          changeVendorOrderStatus();
        })
        .catch((error) => console.log(error));
    }
  });
}

function changeAdminOrderStatus(newStatus, orderDetails) {
  get(child(dbref, 'UsersOrders/'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        var orderList = snapshot.val();
        var listLength = Object.values(orderList).length;
        for (let i = 0; i < listLength; i++) {
          const userDetails = Object.values(orderList)[i];
          if (userDetails['num'] === orderDetails['num']) {
            var newOrderDetails = {
              Orders: {
                status: newStatus,
              },
            };
            update(
              ref(db, 'UsersOrders/' + userDetails['key']),
              newOrderDetails
            )
              .then(() => {
                changeVendorOrderStatus();
              })
              .catch((error) => console.log(error));
          }
        }
      }
    })
    .catch((error) => console.log(error));
}
