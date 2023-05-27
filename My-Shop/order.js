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
  get,
  set,
  update,
  child,
  ref as dref,
} from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-database.js';

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
