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
var arr,
  value,
  numb,
  first,
  last,
  phone,
  gender,
  hostel,
  detail_no,
  form,
  details = JSON.parse(localStorage.getItem('details'));
const db = getDatabase();

var list = document.createElement('form');
window.onload = function () {
  if (details === null) {
    window.location.replace('../Login/');
  } else {
    get_address();
  }
};

function get_address() {
  const dbref = ref(db);
  document.getElementById('loader').style.display = 'block';
  get(child(dbref, 'UsersDetails/'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        document.getElementById('loader').setAttribute('style', 'display:none');
        document.getElementById('body').innerHTML = '';
        document.getElementById('body').style.display = 'block';
        arr = snapshot.val();
        numb = snapshot.val();
        var lenth = Object.keys(numb).length;
        for (var x = lenth - 1; x >= 0; x--) {
          var key = Object.keys(arr)[x];
          var uservalue = arr[key];
          var searchvalue = uservalue['code'];
          if (details['user'] === searchvalue) {
            value = uservalue;
            for (let i = value['details']; i > 0; i--) {
              document.getElementById(
                'body'
              ).innerHTML += `<label class="labl"><input type="radio" ${
                value['address_set' + i] === 'on' ? 'checked' : ''
              }/>
          <div>
            <div class='link-body'>
              <p class="edit-link">Edit</p>
            </div>
            <div id=${i}>
              <div class="flex">
                <div class="title">First Name:</div>
                <div class="info">${value['first' + i]}</div>
              </div>
              <div class="flex">
                <div class="title">Last Name:</div>
                <div class="info">${value['second' + i]}</div>
              </div>
              <div class="flex">
                <div class="title">Phone:</div>
                <div class="info">${value['phone' + i]}</div>
              </div>
              <div class="flex">
                <div class="title">Hostel:</div>
                <div class="info">${value['hostel' + i]}</div>
              </div>
              <div class="flex">
                <div class="title">Gender:</div>
                <div class="info">${value['gender' + i]}</div>
              </div>
            </div>
          </div>
        </label>`;
              onclicked(i, value);
            }
          }
        }
        editClicked();
      }
    })
    .catch((error) => console.log(error));
}

function onclicked(num, value) {
  document.getElementById(num).onclick = function (e) {
    e.preventDefault();
    if (value['details'] > 1 && value['address_set' + num] !== 'on') {
      document.getElementById('loader').style.display = 'block';
      document.getElementById('body').style.display = 'none';
      var addres_set = new Map();
      addres_set['address_set' + num] = 'on';
      for (let i = 1; i <= value['details']; i++) {
        if (i !== num) {
          addres_set['address_set' + i] = 'off';
        }
      }
      update(ref(db, 'UsersDetails/' + details['key']), addres_set)
        .then(() => {
          var new_details = new Object();
          new_details = {
            user: details['user'],
            key: details['key'],
            email: details['email'],
            first: value['first' + num],
            name: value['first' + num] + ' ' + value['second' + num],
            hostel: value['hostel' + num],
            gender: value['gender' + num],
            phone: value['phone' + num],
            login: 'yes',
          };
          localStorage.setItem('details', JSON.stringify(new_details));
          get_address();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
}

function editClicked() {
  var EditBtns = document.getElementsByClassName('edit-link');
  Object.values(EditBtns).forEach((btn, index) => {
    btn.addEventListener('click', () => {
      detail_no = value['details'] - index;
      document.getElementById('edit-first').value = value['first' + detail_no];
      document.getElementById('edit-last').value = value['second' + detail_no];
      document.getElementById('edit-hostel').value =
        value['hostel' + detail_no];
      document.getElementById('edit-phone').value = value['phone' + detail_no];
      document.getElementById('edit-gender').value =
        value['gender' + detail_no];
      document.getElementById('edit-body').style.display = 'flex';
      document
        .getElementById('edit-body')
        .getElementsByTagName('h4')[0].innerText = 'Edit Address';
      form = 'edit';
      document.getElementById('edit-loader').style.display = 'none';
    });
  });
}

document.getElementById('close').addEventListener('click', () => {
  document.getElementById('edit-body').style.display = 'none';
  document.getElementById('edit-first').value = '';
  document.getElementById('edit-last').value = '';
  document.getElementById('edit-phone').value = '';
  document.getElementById('edit-hostel').value = 'Hostel';
  document.getElementById('edit-gender').value = 'Gender';
});

document.getElementById('floating-btn').addEventListener('click', () => {
  document.getElementById('edit-body').getElementsByTagName('h4')[0].innerText =
    'Register new Address';
  form = 'register';
  document.getElementById('edit-body').style.display = 'flex';
  document.getElementById('edit-loader').style.display = 'none';
});

const editForm = document.getElementById('edit-form');
editForm.addEventListener('submit', submit, false);

function submit(e) {
  e.preventDefault();
  ready();
  if (
    first !== '' &&
    last !== '' &&
    phone !== '' &&
    gender !== 'Gender' &&
    hostel !== 'Hostel'
  ) {
    document.getElementById('edit-loader').style.display = 'block';
    form === 'edit' ? edit_address() : create_address();
  } else {
    alert('Fill all Fields');
  }
}

function edit_address() {
  const dbref = ref(db);
  get(child(dbref, 'UsersDetails/'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        arr = snapshot.val();
        numb = snapshot.val();
        var lenth = Object.keys(numb).length;
        for (var x = lenth - 1; x >= 0; x--) {
          var key = Object.keys(arr)[x];
          var value = arr[key];
          var searchvalue = value['code'];
          if (details['user'] === searchvalue) {
            var details_no = detail_no;
            update(ref(db, 'UsersDetails/' + details['key']), {
              ['first' + details_no]: first,
              ['second' + details_no]: last,
              ['hostel' + details_no]: hostel,
              ['phone' + details_no]: phone,
              ['gender' + details_no]: gender,
            })
              .then(() => {
                document.getElementById('edit-loader').style.display = 'none';
                document.getElementById('edit-body').style.display = 'none';
                get_address();
              })
              .catch((error) => {
                document.getElementById('edit-loader').style.display = 'none';
                alert(error);
              });
          }
        }
      }
    })

    .catch((error) => {
      console.log(error);
    });
}

function create_address() {
  const dbref = ref(db);
  get(child(dbref, 'UsersDetails/'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        arr = snapshot.val();
        numb = snapshot.val();
        var lenth = Object.keys(numb).length;
        for (var x = lenth - 1; x >= 0; x--) {
          var key = Object.keys(arr)[x];
          var value = arr[key];
          var searchvalue = value['code'];
          if (details['user'] === searchvalue) {
            var details_no = parseInt(value['details']) + 1;
            update(ref(db, 'UsersDetails/' + details['key']), {
              ['first' + details_no]: first,
              ['second' + details_no]: last,
              ['hostel' + details_no]: hostel,
              ['phone' + details_no]: '+234' + phone,
              ['gender' + details_no]: gender,
              ['details']: details_no,
              ['address_set' + details_no]: 'off',
            })
              .then(() => {
                document.getElementById('edit-loader').style.display = 'none';
                document.getElementById('edit-body').style.display = 'none';
                get_address();
              })
              .catch((error) => {
                document.getElementById('edit-loader').style.display = 'none';
                alert(error);
              });
          }
        }
      }
    })

    .catch((error) => {
      console.log(error);
    });
}

function ready() {
  first = document.getElementById('edit-first').value;
  last = document.getElementById('edit-last').value;
  phone = document.getElementById('edit-phone').value;
  hostel = document.getElementById('edit-hostel').value;
  gender = document.getElementById('edit-gender').value;
}
