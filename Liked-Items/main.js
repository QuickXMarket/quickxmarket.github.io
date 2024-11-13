import { getDatabase, ref, get, child } from "../firebase.js";

let savedItems,
  productImages,
  productName,
  productPrice,
  products,
  totalProducts,
  productValue;
let cartItems = [];
const numberFormatter = new Intl.NumberFormat("en-US");

const createProductElement = (index, productCode, savedItemIndex) => {
  const cartItem = cartItems.find((item) => item.code === productCode);
  const cartIndex = cartItems.findIndex((item) => item.code === productCode);
  
  document.getElementById("loader").style.display = "none";
  document.getElementById("page_body").style.display = "block";
  document.getElementById("item_list").style.display = "block";

  const itemList = document.getElementById("item_list");

  const productContainer = document.createElement("div");
  productContainer.classList.add("item-view");

  const productImageElement = createImageElement(
    "item-image",
    productImages[0]
  );
  const productNameElement = createTextElement("item-name", productName);
  const productPriceElement = createTextElement(
    "item-price",
    `₦${numberFormatter.format(productPrice)}`
  );

  const productLink = createProductLink(productCode);
  const productFlexContainer = createFlexContainer(
    productImageElement,
    productNameElement,
    productPriceElement
  );

  productLink.appendChild(productFlexContainer);
  productContainer.appendChild(productLink);

  const controlsContainer = createControls(index, cartItem, cartIndex);
  productContainer.appendChild(controlsContainer);

  itemList.appendChild(productContainer);
  if (!cartItem) attachAddToCartHandler(`add${index}`, productCode);
  attachRemoveFavoriteHandler(`remove${index}`, savedItemIndex);
};

const loadSavedItems = () => {
  toggleLoader(true);

  savedItems = JSON.parse(localStorage.getItem("saved_items")) || [];
  cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const itemList = document.getElementById("item_list");
  itemList.innerHTML = "";

  if (savedItems && savedItems.length > 0) {
    const db = getDatabase();
    const dbRef = ref(db);

    get(child(dbRef, "ProductsDetails/"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          products = snapshot.val();
          totalProducts = Object.keys(products).length;

          savedItems.forEach((item, index) => {
            for (let i = 0; i < totalProducts; i++) {
              const productCode = savedItems[index].code;
              const key = Object.keys(products)[i];
              productValue = products[key];

              if (productValue.code === productCode) {
                ({
                  price: productPrice,
                  name: productName,
                  url: productImages,
                } = productValue);
                createProductElement(index + 1, productValue.code, index);
              }
            }
          });
        }
        displayRecentItems();
      })
      .catch((error) => console.error(error));
  } else {
    toggleLoader(false, "no_items");
  }
};

const toggleLoader = (showLoader, elementToShow = null) => {
  document.getElementById("loader").style.display = showLoader
    ? "block"
    : "none";
  document.getElementById("page_body").style.display = showLoader
    ? "none"
    : "block";
  if (elementToShow) {
    document.getElementById(elementToShow).style.display = showLoader
      ? "none"
      : "block";
  }
};

const attachAddToCartHandler = (buttonId, productCode) => {
  document.getElementById(buttonId).onclick = () => {
    const updatedCartItems = [...cartItems, { code: productCode, amount: 1 }];
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));

    loadSavedItems();
  };
};

const attachRemoveFavoriteHandler = (buttonId, savedItemIndex) => {
  document.getElementById(buttonId).onclick = () => {
    savedItems.splice(savedItemIndex, 1);
    localStorage.setItem("saved_items", JSON.stringify(savedItems));
    loadSavedItems();
  };
};

const displayRecentItems = () => {
  const recentItems = JSON.parse(localStorage.getItem("recent"));

  if (recentItems || recentItems.length > 0) {
    const recentContainer = document.getElementById("recent");
    recentContainer.innerHTML = "";

    recentItems.forEach((recentItem) => {
      Object.entries(products).forEach(([key, product]) => {
        if (product.code === recentItem.code) {
          const recentLink = createProductLink(product.code);
          recentLink.classList.add("rec_view");
          const recentImageElement = createImageElement(
            "rec_image",
            product.url[0]
          );
          const recentPriceElement = createTextElement(
            "rec_price",
            `₦${numberFormatter.format(product.price)}`
          );

          recentLink.appendChild(recentImageElement);
          recentLink.appendChild(recentPriceElement);
          recentContainer.appendChild(recentLink);
        }
      });
    });
  } else {
    document.getElementById("rec").style.display = "none";
  }
};

const createImageElement = (className, src) => {
  const img = document.createElement("img");
  img.classList.add(className);
  img.src = src;
  return img;
};

const createTextElement = (className, text) => {
  const textElement = document.createElement("p");
  textElement.classList.add(className);
  textElement.textContent = text;
  return textElement;
};

const createFlexContainer = (
  productImageElement,
  productNameElement,
  productPriceElement
) => {
  const flexContainer = document.createElement("div");
  flexContainer.classList.add("flex");
  const detailsContainer = document.createElement("div");
  detailsContainer.style.padding = "8px";

  detailsContainer.appendChild(productNameElement);
  detailsContainer.appendChild(productPriceElement);
  flexContainer.appendChild(productImageElement);
  flexContainer.appendChild(detailsContainer);
  return flexContainer;
};

const createProductLink = (productCode) => {
  const productLink = document.createElement("a");
  const productURL = new URL(
    `${window.location.protocol}//${window.location.host}/Product/`
  );
  productURL.searchParams.append("product", productCode);
  productLink.href = productURL;
  return productLink;
};

const createControls = (index, cartItem, cartIndex) => {
  const controlsContainer = document.createElement("div");
  controlsContainer.classList.add("controls", "flex");
  const controlsFlex = document.createElement("div");
  controlsFlex.classList.add("flex");

  const removeButtonContainer = document.createElement("div");
  removeButtonContainer.classList.add("remove");
  removeButtonContainer.setAttribute("id", `remove${index}`);

  const removeIcon = createImageElement(null, "../images/ic_delete_black.png");
  const removeText = createTextElement(null, "Remove");

  removeButtonContainer.appendChild(removeIcon);
  removeButtonContainer.appendChild(removeText);

  controlsContainer.appendChild(removeButtonContainer);
  controlsContainer.appendChild(controlsFlex);
  if (!cartItem) {
    let addButtonContainer = document.createElement("div");
    let addButton = document.createElement("button");
    addButton.setAttribute("id", `add${index}`);
    addButton.innerText = "Add to Cart";
    addButtonContainer.appendChild(addButton);
    controlsContainer.appendChild(addButtonContainer);
  } else {
    const cartNum = document.createElement("p");
    cartNum.id = `cartnum${cartIndex}`;
    cartNum.textContent = cartItem.amount;

    const addBtn = createButton("add", `add${cartIndex}`, () =>
      updateCartQuantity(cartIndex, 1)
    );
    const minusBtn = createButton("minus", `minus${cartIndex}`, () =>
      updateCartQuantity(cartIndex, -1)
    );
    controlsContainer.appendChild(minusBtn);
    controlsContainer.appendChild(cartNum);
    controlsContainer.appendChild(addBtn);
  }
  return controlsContainer;
};

function updateCartQuantity(index, delta) {
  const cartNumElem = document.getElementById(`cartnum${index}`);
  let newQuantity = parseInt(cartNumElem.textContent) + delta;

  if (newQuantity < 1) {
    removeCartItem(index);
  } else {
    cartNumElem.textContent = newQuantity;
    cartItems[index].amount = newQuantity;
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }
}

function removeCartItem(index) {
  cartItems.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  loadSavedItems();
}

function createButton(type, id, onClick) {
  const button = document.createElement("img");
  button.id = id;
  button.src =
    type === "remove"
      ? `../images/ic_delete_black.png`
      : type === "add"
      ? "../images/ic_add_circle_black.png"
      : "../images/ic_remove_circle_black.png";
  button.onclick = onClick;
  return button;
}

window.onload = loadSavedItems;
