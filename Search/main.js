import { get, child, getDatabase, ref } from "../firebase.js";

const db = getDatabase();
const numberFormatter = new Intl.NumberFormat("en-US");
const recentItems = JSON.parse(localStorage.getItem("recent")) || [];

window.onload = () => {
  updateCartCount();
  document.getElementById("title").textContent = window.location.host;

  const searchQuery = new URLSearchParams(window.location.search).get("search");
  document.getElementById("div2").value = searchQuery;

  fetchProductDetails(searchQuery);
};

const updateCartCount = () => {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cartItems.length;

  document.getElementById("cart_num").textContent = cartCount;
  document.getElementById("cart_num2").textContent = cartCount;
};

const fetchProductDetails = (searchQuery) => {
  const dbRef = ref(db);

  get(child(dbRef, "ProductsDetails/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        document.getElementById("loader").style.display = "none";
        document.getElementById("body").style.display = "block";

        const products = snapshot.val();
        const productKeys = Object.keys(products);

        productKeys.reverse().forEach((key) => {
          const product = products[key];
          const productName = product["name"].toLowerCase();

          if (productName.includes(searchQuery.toLowerCase())) {
            displayProduct(product);
          }
        });
        displayRecentItems(products);
      }
    })
    .catch((error) => console.error(error));
};

const displayProduct = (product) => {
  const productURL = new URL(
    `${window.location.protocol}//${window.location.host}/Product/`
  );
  productURL.searchParams.append("product", product["code"]);

  const productHTML = `
    <a href="${productURL}" class="col-sm-6 col-lg-4 items_view d-sm-inline-flex">
      <img class="item_image" src="${product["url"][0]}" >
      <div>
        <div class="item_name">${product["name"]}</div>
        <div class="item_price">₦${numberFormatter.format(
          product["price"]
        )}</div>
      </div>
    </a>
  `;

  document.getElementById("list").innerHTML += productHTML;
};

const handleSearch = () => {
  const searchQuery = document.getElementById("div2").value;
  const searchURL = new URL(
    `${window.location.protocol}//${window.location.host}/Search/`
  );
  searchURL.searchParams.append("search", searchQuery);
  window.location = searchURL;
};

function displayRecentItems(products) {
  if (Object.values(recentItems).length < 1) {
    Object.values(recentItems)
      .slice(0, 10)
      .forEach((item) => {
        const recentProduct = Object.values(products).find(
          (product) => product.code === item.code
        );
        if (recentProduct) {
          const myURL = new URL(
            `${window.location.protocol}//${window.location.host}/Product/`
          );
          myURL.searchParams.append("product", recentProduct.code);

          const recentHTML = `
          <a href="${myURL}" class="rec_view">
            <img class="rec_image" src="${recentProduct.url[0]}">
            <p class="rec_price">₦${numberFormatter.format(
              recentProduct.price
            )}</p>
          </a>
        `;

          document.getElementById("recent").innerHTML += recentHTML;
        }
      });
  } else document.getElementById("rec").style.display = "none";
}

document.getElementById("div2").addEventListener("search", handleSearch);
