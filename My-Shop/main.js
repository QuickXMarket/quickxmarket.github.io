import {
  get,
  getAuth,
  getDatabase,
  set,
  update,
  child,
  storageRef,
  getDownloadURL,
  storage,
  ref,
  uploadBytes,
  onAuthStateChanged,
  remove,
} from "../firebase.js";
import { getVendorOrders } from "./order.js";

const db = getDatabase();

var details = JSON.parse(localStorage.getItem("details")),
  categories = [
    "Shoes",
    "Phone Accessories",
    "Clothing",
    "Apartments",
    "Perfume and Oil",
  ],
  SelecteIndexes = [],
  SelectedCategories = [],
  name,
  phone,
  price,
  description,
  quantity,
  category,
  logoImg = "",
  logoImgUrl = "",
  ItemImgs = [],
  ItemImgsUrl = [],
  vendorName,
  vendorId,
  RegisteredItems,
  vendorDetails,
  userID;

onload = () => {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userID = user.uid;
      checkAccountType();
    } else {
      window.location.replace("../Login");
    }
  });
};

function checkAccountType() {
  const dbref = ref(db);
  get(child(dbref, "UsersDetails/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        var userList = snapshot.val();
        const userDetails = Object.values(userList).find(
          (user) => user.id === userID
        );
        const AccountType = userDetails["AccountType"];
        switch (AccountType) {
          case "user":
            document.getElementById("register").style.display = "flex";
            break;
          case "vendor":
            getShopData();
            break;
        }
      }
    })
    .catch((error) => console.log(error));
}

export function getShopData() {
  document.getElementById("loader").style.display = "block";
  document.getElementById("item_body").style.display = "none";
  document.getElementById("no_items").style.display = "none";
  document.getElementById("items").innerHTML = "";
  const dbref = ref(db);
  get(child(dbref, "VendorsDetails/" + userID))
    .then((snapshot) => {
      vendorDetails = snapshot.val();

      document.getElementById("business-icon").src =
        vendorDetails["vendorLogo"] !== ""
          ? vendorDetails["vendorLogo"]
          : "../images/PngItem_248631.png";

      document.getElementById("vendor-name").innerText =
        vendorDetails["vendorName"];

      vendorName = vendorDetails["vendorName"];
      vendorId = vendorDetails["vendorId"];
      RegisteredItems = vendorDetails.products;
      getVendorOrders(vendorDetails);

      get(child(dbref, "ProductsDetails/"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const products = snapshot.val();
            const vendorItems = Object.values(products).filter(
              (product) => product.vendorID === vendorId
            );
            vendorItems.forEach((product, index) => {
              const myURL = new URL(
                window.location.protocol +
                  "//" +
                  window.location.host +
                  "/Product"
              );
              myURL.searchParams.append("product", product["code"]);
              document.getElementById("items").innerHTML += `
                   <div class="item-view col" >
            <a href=${myURL}
              ><div class="flex" id="item-view1">
                <img
                  class="item-image"
                  src=${product["url"][0]}/>
                <div style="padding: 8px">
                  <p class="item-name">${product["name"]}</p>
                  <p class="item-price">${product["price"]}</p>
                </div>
              </div></a
            >
            <div class="controls flex">
              <div id= 'remove${index}' class="remove">
                <img src="../images/ic_delete_black.png" />
                <p>Remove</p>
              </div>
              <div class="flex"></div>
              <p style =" margin-right: 3px">Avaialble: </p>
              <p id="itemnum1">${
                product["quantity"] !== "" ? product["quantity"] : "?"
              }</p>
            </div>
          </div>`;

              handleProductRemove(index, product.key);
            });
            document.getElementById("no_items").style.display =
              vendorItems.length === 0 ? "block" : "none";
          } else {
            document.getElementById("no_items").style.display = "block";
          }
        })
        .catch((error) => console.log(error));

      document.getElementById("loader").style.display = "none";
      document.getElementById("item_body").style.display = "block";
    })
    .catch((error) => console.log(error));
}

const uploadForm = document.getElementById("upload-item");
uploadForm.addEventListener("submit", uploadCheckdata, false);

function uploadCheckdata(e) {
  e.preventDefault();
  name = document.getElementById("name").value;
  price = document.getElementById("price").value;
  description = document.getElementById("description").value;
  quantity = document.getElementById("quantity").value;
  category = document.getElementById("category").value;

  price = price.replace(/,/g, "");

  if (category !== " Select Category" && ItemImgs.length > 0) {
    document.getElementById("uploadLoader").style.display = "block";
    uploadFile(ItemImgs[0], "ProductImage", 0);
  }
}

function uploadProduct() {
  var key = "-";
  for (let i = 0; i < 19; i++) {
    key = key + generateRandomLetter();
  }

  var itemCode = generateRandomLetter();
  for (let i = 0; i < 11; i++) {
    itemCode += generateRandomLetter();
  }

  const productDetails = {
    category,
    code: itemCode,
    description,
    key,
    name,
    num: ItemImgsUrl.length,
    price,
    quantity,
    vendorID: vendorId,
    url: [],
  };

  ItemImgsUrl.forEach((url, index) => (productDetails["url"][index] = url));

  set(ref(db, "ProductsDetails/" + key), productDetails)
    .then(() => {
      ItemImgs = [];
      ItemImgsUrl = [];
      ItemImgs = [];
      ItemImgsUrl = [];
      document.getElementById("upload-item").style.display = "none";
      document.getElementById("uploadLoader").style.display = "none";
      update(ref(db, `VendorsDetails/${userID}`), {
        products: [...RegisteredItems, itemCode],
      })
        .then(() => getShopData())
        .catch((error) =>
          console.error("Error updating vendor products:", error)
        );
    })
    .catch((error) => {
      console.log(error);
    });
}

function handleProductRemove(index, productKey) {
  document.getElementById(`remove${index}`).addEventListener("click", () => {
    const newRegisteredItems = RegisteredItems.splice(index, 1);
    update(ref(db, `VendorsDetails/${userID}`), {
      products: newRegisteredItems,
    })
      .then(() => deleteProduct(productKey))
      .catch((error) => console.log(error));
  });
}

function deleteProduct(productKey) {
  const db = getDatabase();
  const nodeRef = ref(db, `ProductsDetails/${productKey}`);

  remove(nodeRef)
    .then(() => getShopData())
    .catch((error) => {
      console.error("Error removing node:", error);
    });
}

//Handle Registration Categories Selection
function regCategoriesSelect() {
  const regCategories = document.getElementsByClassName("category");
  Object.values(regCategories).forEach((category, index) => {
    category.addEventListener("click", () => {
      if (SelecteIndexes.includes(index)) {
        var categoryIndex = SelecteIndexes.indexOf(index);
        SelecteIndexes = SelecteIndexes.splice(categoryIndex, 1);
        category.style.backgroundColor = "transparent";
      } else {
        SelecteIndexes.push(index);
        category.style.backgroundColor = "#ccc";
      }
    });
  });
}

const registerform = document.getElementById("register-form");
registerform.addEventListener("submit", reg_Checkdata, false);
regCategoriesSelect();

function reg_Checkdata(e) {
  e.preventDefault();
  name = document.getElementById("business-name").value;
  phone = document.getElementById("phone").value;

  if (SelecteIndexes.length > 0) {
    document.getElementById("registerLoader").style.display = "block";
    name = name === "" ? details["name"] : name;
    SelecteIndexes.forEach((index) =>
      SelectedCategories.push(categories[index])
    );
    logoImg !== "" ? uploadFile(logoImg, "VendorLogo") : RegisterVendor();
  } else {
  }
}

function RegisterVendor() {
  var id = generateRandomLetter();
  for (let i = 0; i < 8; i++) {
    id += generateRandomLetter();
  }
  set(ref(db, "VendorsDetails/" + userID), {
    vendorName: name,
    vendorId: id,
    addPhoneNo: phone,
    vendorLogo: logoImgUrl,
    vendorCat: SelectedCategories,
  })
    .then(() => {
      update(ref(db, "UsersDetails/" + userID), {
        AccountType: "vendor",
      })
        .then(() => {
          details["AccountType"] = "vendor";
          localStorage.setItem("details", JSON.stringify(details));
          details = JSON.parse(localStorage.getItem("details"));
          document.getElementById("register").style.display = "none";
          document.getElementById("registerLoader").style.display = "none";
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

function uploadFile(file, folder, index) {
  const storagePath =
    folder === "VendorLogo"
      ? `${folder}/${vendorDetails["vendorName"]}/${file.name}`
      : `${folder}/${vendorDetails["vendorName"]}/name/${file.name} `;
  const storagePathRef = storageRef(storage, storagePath);

  uploadBytes(storagePathRef, file)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((downloadURL) => {
          if (folder === "VendorLogo") {
            logoImgUrl = downloadURL;
            RegisterVendor();
          } else {
            ItemImgsUrl.push(downloadURL);
            const fileList = document.getElementsByClassName("file-list")[0];
            fileList.removeChild(fileList.children[0]);
            if (index + 1 === ItemImgs.length) {
              uploadProduct();
            } else {
              uploadFile(ItemImgs[index + 1], "ProductImage", index + 1);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to get download URL:", error);
        });
    })
    .catch((error) => {
      console.error("Upload error:", error);
    });
}

// Get drop area element
const dropArea = document.getElementsByClassName("drop-area");

// Prevent default drag behaviors
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  Object.values(dropArea).forEach((element) =>
    element.addEventListener(eventName, preventDefaults, false)
  );
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
["dragenter", "dragover"].forEach((eventName) => {
  Object.values(dropArea).forEach((element, index) =>
    element.addEventListener(
      eventName,
      () => {
        element.classList.add("highlight");
      },
      false
    )
  );
});

// Remove highlight when item is dragged out of the drop area
["dragleave", "drop"].forEach((eventName) => {
  Object.values(dropArea).forEach((element, index) =>
    element.addEventListener(
      eventName,
      () => {
        element.classList.remove("highlight");
      },
      false
    )
  );
});

// Handle dropped files
Object.values(dropArea).forEach((element, index) =>
  element.addEventListener(
    "drop",
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
    if (file.type.includes("image")) {
      const listItem = document.createElement("li");
      listItem.textContent = file.name;
      if (index === 0) {
        document
          .getElementsByClassName("file-list")
          [index].appendChild(listItem);

        ItemImgs.push(file);
      } else if (index === 1) {
        document.getElementsByClassName("file-list")[index].innerHTML =
          listItem;
        logoImg = file;
      }

      // uploadFile(file);
    }
  }
}

// Handle file input change
const file_input = document.getElementsByClassName("file-input");
Object.values(file_input).forEach((element, index) => {
  element.addEventListener("change", function () {
    const files = this.files;
    handleFiles(files, index);
  });
});

function generateRandomLetter() {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

const closeBtn = document.getElementsByClassName("close");
Object.values(closeBtn).forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (index === 0) {
      document.getElementsByClassName("floating-body")[index].style.display =
        "none";
    } else {
      window.location.href = "../Settings";
    }
  });
});

[
  document.getElementById("floating-btn"),
  document.getElementById("continue"),
].forEach((element) =>
  element.addEventListener("click", () => {
    document.getElementById("upload-item").style.display = "flex";
  })
);

const itemPrice = document.getElementById("price");
itemPrice.addEventListener("input", () => {
  var value = itemPrice.value.replace(/,/g, "");
  // Format the value with commas
  var formattedValue = Number(value).toLocaleString("en");
  // Set the formatted value back to the itemPrice field
  itemPrice.value = formattedValue;
});
