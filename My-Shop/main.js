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
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-storage.js';

import {
  getDatabase,
  get,
  set,
  update,
  child,
  ref as dref,
} from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-database.js';

const db = getDatabase();

var details = JSON.parse(localStorage.getItem('details')),
  categories = [
    'Shoes',
    'Phone Accessories',
    'Clothing',
    'Apartments',
    'Perfume and Oil',
  ],
  SelecteIndexes = [],
  SelectedCategories = [],
  name,
  phone,
  price,
  description,
  quantity,
  category,
  logoImg = '',
  logoImgUrl = '',
  ItemImgs = [],
  ItemImgsUrl = [],
  vendorName;

onload = () => {
  if (details === null) {
    window.location.replace('../Login');
  } else {
    switch (details['AccountType']) {
      case 'user':
        document.getElementById('register').style.display = 'flex';
        break;
      case 'vendor':
        getShopData();
        break;
    }
  }
};

//Retrieve and Display Vendor's Details
function getShopData() {
  const dbref = dref(db);
  get(child(dbref, 'Vendor/' + details['key']))
    .then((snapshot) => {
      console.log(snapshot);
      document.getElementById('business-icon').src = snapshot['LogoUrl'];
      document.getElementById('vendor-name').innerText =
        snapshot['BusinessName'];
      vendorName = snapshot['BusinessName'];
      for (let i = 1; i <= snapshot['RegisteredItems']; i++) {
        get(child(dbref, 'ProductsDetails/'))
          .then((snapshot) => {
            if (snapshot.exists()) {
              arr = snapshot.val();
              lenth = Object.keys(numb).length;

              for (let x = lenth - 1; x >= 0; x--) {
                var key = Object.keys(arr)[x];
                var value = arr[key];
                var searchvalue = value['email'];
                if (snapshot['Item' + i] === searchvalue) {
                  const myURL = new URL(
                    window.location.protocol +
                      '//' +
                      window.location.host +
                      '/Product'
                  );
                  myURL.searchParams.append('product', value['code']);
                  document.getElementById('items').innerHTML += `
                   <div class="item-view">
            <a href=${myURL}
              ><div class="flex" id="item-view1">
                <img
                  class="item-image"
                  src=${value['url0']}/>
                <div style="padding: 8px">
                  <p class="item-name">${value['name']}</p>
                  <p class="item-price">${value['price']}</p>
                </div>
              </div></a
            >
            <div class="controls flex">
              <div id="remove1" class="remove">
                <img src="../images/ic_delete_black.png" />
                <p>Remove</p>
              </div>
              <div class="flex"></div>
              <p>Product Quantity Avaialble</p>
              <p id="itemnum1">${
                value['quantity'] !== '' ? value['quantity'] : '?'
              }</p>
            </div>
          </div>`;
                }
              }
            }
          })
          .catch((error) => console.log(error));
      }
    })
    .catch((error) => console.log(error));
}

const uploadForm = document.getElementById('upload-item');
uploadForm.addEventListener('submit', uploadCheckdata, false);

function uploadCheckdata(e) {
  e.preventDefault();
  name = document.getElementById('name').value;
  price = document.getElementById('price').value;
  description = document.getElementById('description').value;
  quantity = document.getElementById('quantity').value;
  category = document.getElementById('category').value;

  if (category !== ' Select Category' && ItemImgs.length > 0) {
    ItemImgs.forEach((img, index) => uploadFile(img, 'ProductImage', index));
  }
}

function uploadProduct() {
  var key = '-';
  for (let i = 0; i < 19; i++) {
    key = key + generateRandomLetter();
  }
  get(child(dbref, 'ProductsDetails/'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        arr = snapshot.val();
        lenth = Object.keys(numb).length;
        if (length > 0) {
          var key = Object.keys(arr)[length - 1];
          var value = arr[key];
          var lastKey = value['code'];
          var code = lastKey + 1;
        } else {
          code = 100001;
        }

        const productDetails = {
          category,
          code,
          description,
          key,
          name,
          num: ItemImgsUrl.length,
          price,
          quantity,
          vendor: vendorName,
        };

        ItemImgsUrl.forEach(
          (url, index) => (productDetails['url' + index] = url)
        );

        set(dref(db, 'ProductsDetails/' + key), productDetails)
          .then(() => {
            ItemImgs = [];
            ItemImgsUrl = [];
            document.getElementById('upload-item').style.display = 'none';
            getShopData();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => console.log(error));
}

//Handle Registration Categories Selection
function regCategoriesSelect() {
  const regCategories = document.getElementsByClassName('category');
  Object.values(regCategories).forEach((category, index) => {
    category.addEventListener('click', () => {
      if (SelecteIndexes.includes(index)) {
        var categoryIndex = SelecteIndexes.indexOf(index);
        SelecteIndexes = SelecteIndexes.splice(categoryIndex, 1);
        category.style.backgroundColor = 'transparent';
      } else {
        SelecteIndexes.push(index);
        category.style.backgroundColor = '#ccc';
      }
    });
  });
}

const registerform = document.getElementById('register-form');
registerform.addEventListener('submit', reg_Checkdata, false);
regCategoriesSelect();

function reg_Checkdata(e) {
  e.preventDefault();
  name = document.getElementById('business-name').value;
  phone = document.getElementById('phone').value;

  if (SelecteIndexes.length > 0) {
    name = name === '' ? details['name'] : name;
    SelecteIndexes.forEach((index) =>
      SelectedCategories.push(categories[index])
    );
    logoImg !== '' ? uploadFile(logoImg, 'VendorLogo') : RegisterVendor();
  } else {
  }
}

function RegisterVendor() {
  console.log(details['key']);
  set(dref(db, 'Vendor/' + details['key']), {
    BusinessName: name,
    Phone: phone,
    LogoUrl: logoImgUrl,
    Categories: SelectedCategories,
  })
    .then(() => {
      // Update Account Type
      update(dref(db, 'UsersDetails/' + details['key']), {
        AccountType: 'vendor',
      })
        .then(() => {
          document.getElementById('register').style.display = 'none';
          getShopData();
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

// Create a root reference
const storage = getStorage(app);

function uploadFile(file, folder, index) {
  // Create a storage reference
  console.log(file);
  const storageRef = ref(storage, folder + name);

  // Upload file
  uploadBytes(storageRef, file)
    .then((snapshot) => {
      getDownloadURL(storageRef)
        .then((downloadURL) => {
          if (folder === 'VendorLogo') {
            logoImgUrl = downloadURL;
            RegisterVendor();
          } else {
            ItemImgsUrl.push(downloadURL);
            if (index + 1 === ItemImgs.length) {
              uploadProduct();
            }
          }
        })
        .catch((error) => {
          console.error('Failed to get download URL:', error);
        });
    })
    .catch((error) => {
      console.error('Upload error:', error);
    });
}

// Get drop area element
const dropArea = document.getElementsByClassName('drop-area');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  Object.values(dropArea).forEach((element) =>
    element.addEventListener(eventName, preventDefaults, false)
  );
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach((eventName) => {
  Object.values(dropArea).forEach((element, index) =>
    element.addEventListener(
      eventName,
      () => {
        element.classList.add('highlight');
      },
      false
    )
  );
});

// Remove highlight when item is dragged out of the drop area
['dragleave', 'drop'].forEach((eventName) => {
  Object.values(dropArea).forEach((element, index) =>
    element.addEventListener(
      eventName,
      () => {
        element.classList.remove('highlight');
      },
      false
    )
  );
});

// Handle dropped files
Object.values(dropArea).forEach((element, index) =>
  element.addEventListener(
    'drop',
    (e) => {
      const files = e.dataTransfer.files;
      handleFiles(files, index);
    },
    false
  )
);

// Prevent default behavior
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Handle selected files
function handleFiles(files, index) {
  // Show selected files in the file list
  for (const file of files) {
    if (file.type.includes('image')) {
      const listItem = document.createElement('li');
      listItem.textContent = file.name;
      if (index === 0) {
        document
          .getElementsByClassName('file-list')
          [index].appendChild(listItem);
        ItemImgs.push(file);
      } else if (index === 1) {
        document.getElementsByClassName('file-list')[index].innerHTML =
          listItem;
        logoImg = file;
      }

      // uploadFile(file);
    }
  }
}

// Handle file input change
const file_input = document.getElementsByClassName('file-input');
Object.values(file_input).forEach((element, index) => {
  element.addEventListener('change', function () {
    const files = this.files;
    handleFiles(files, index);
  });
});

function generateRandomLetter() {
  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

const closeBtn = document.getElementsByClassName('close');
Object.values(closeBtn).forEach((btn, index) => {
  btn.addEventListener('click', () => {
    document.getElementsByClassName('floating-body')[index].style.display =
      'none';
  });
});

document.getElementById('floating-btn').addEventListener('click', () => {
  document.getElementById('upload-item').style.display = 'flex';
});
