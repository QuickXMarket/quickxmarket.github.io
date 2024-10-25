import {
  getDatabase,
  ref,
  get,
  child,
  onAuthStateChanged,
  getAuth,
  update,
} from "/firebase.js";

const db = getDatabase();
let order = {};
let totalPrice = 0;
let products = {};
let userID, orderId;
let vendorDetails;
const formatter = new Intl.NumberFormat("en-US");

onload = () => {
  const searchParams = new URLSearchParams(window.location.search);
  orderId = searchParams.get("order");
  const auth = getAuth();

  if (!orderId) {
    window.location.replace("../");
  } else {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userID = user.uid;
        fetchVendorOrders();
      } else {
        window.location.replace("../Login");
      }
    });
  }
};

function fetchVendorOrders() {
  const dbref = ref(db);
  get(child(dbref, `VendorsDetails/${userID}`)).then((snapshot) => {
    if (snapshot.exists()) {
      vendorDetails = snapshot.val();
      const vendorOrders = vendorDetails.orders;
      order = vendorOrders.find((order) => order.orderId === orderId);
      fetchProductDetails();
    }
  });
}

function fetchProductDetails() {
  document.getElementById("loader").style.display = "block";
  document.getElementById("body").style.display = "none";
  const dbref = ref(db);
  get(child(dbref, "ProductsDetails/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        products = snapshot.val();
        if (order && products) {
          renderProducts();
        } else {
          toggleEmptyCartView(true);
        }
      }
    })
    .catch((error) => console.error(error));
}

function renderProducts() {
  document.getElementById("continue").style.display = "none";
  const productContainer = document.getElementById("products");
  productContainer.textContent = "";
  totalPrice = 0;

  order.orders.forEach((product, index) => {
    const productDetails = Object.values(products).find(
      (item) => item.code === product.code
    );
    if (productDetails) {
      const { name, price, url } = productDetails;
      const { amount } = product;
      totalPrice += price * amount;
      createCartItemView(productContainer, name, price, url[0], amount, index);
    }
  });

  document.getElementById("total").textContent = `₦${formatter.format(
    totalPrice
  )}`;
  document.getElementById("status").textContent = order.status;

  if (order.status === "Confirming Request") {
    document.getElementById("continue").style.display = "block";
    document.getElementById("continue").textContent = "Confirm Request";
    document
      .getElementById("continue")
      .addEventListener("click", handleStatusUpdate);
  }

  toggleEmptyCartView(false);
}

function createCartItemView(container, name, price, imageUrl, quantity) {
  const view = document.createElement("div");
  view.classList.add("item-view");

  const productLink = document.createElement("a");
  productLink.href = imageUrl;

  const detailsFlexContainer = document.createElement("div");
  detailsFlexContainer.classList.add("flex");

  const detailsContainer = document.createElement("div");
  detailsContainer.style.padding = "8px";

  const quantityFlexContainer = document.createElement("div");
  quantityFlexContainer.classList.add("flex", "quantityContainer");

  const image = document.createElement("img");
  image.classList.add("item-image");
  image.src = imageUrl;

  const itemName = document.createElement("p");
  itemName.classList.add("item-name");
  itemName.textContent = name;

  const itemPrice = document.createElement("p");
  itemPrice.classList.add("item-price");
  itemPrice.textContent = `₦${formatter.format(price)}`;

  const quantityText = document.createElement("p");
  quantityText.classList.add("quantity-text");
  quantityText.textContent = "Quantity: ";
  const itemQuantity = document.createElement("p");
  itemQuantity.classList.add("item-quantity");
  itemQuantity.textContent = quantity;

  detailsContainer.append(itemName, itemPrice);
  detailsFlexContainer.append(image, detailsContainer);
  quantityFlexContainer.append(quantityText, itemQuantity);
  productLink.append(detailsFlexContainer, quantityFlexContainer);

  view.append(productLink);
  container.append(view);
}

function toggleEmptyCartView(isEmpty) {
  document.getElementById("loader").style.display = "none";
  document.getElementById("body").style.display = "block";
  document.getElementById("products").style.display = isEmpty
    ? "none"
    : "block";
  document.getElementById("info").style.display = isEmpty ? "none" : "block";
}

function handleStatusUpdate(e) {
  e.preventDefault();
  const status = e.target.innerText;
  if (status === "Confirm Request") {
    changeUserOrderStatus("Request confirmed");
  }
}

function changeUserOrderStatus(newStatus) {
  get(child(ref(db), "UsersDetails/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const user = Object.values(users).find(
          (userDetails) => userDetails.code === order.userId
        );

        const userOrders = user.orders;
        const orderIndex = userOrders.findIndex(
          (userOrder) => userOrder.orderId === order.orderId
        );

        if (orderIndex > -1) {
          userOrders[orderIndex].status = newStatus;
          update(ref(db, `UsersDetails/${user.id}`), { orders: userOrders })
            .then(() => changeVendorOrderStatus(newStatus))
            .catch((error) => console.log(error));
        }
      }
    })
    .catch((error) => console.log(error));
}

function changeVendorOrderStatus(newStatus) {
  const vendorOrders = vendorDetails.orders;
  const orderIndex = vendorOrders.findIndex(
    (vendorOrder) => vendorOrder.orderId === order.orderId
  );
  vendorOrders[orderIndex].status = newStatus;
  update(ref(db, `VendorsDetails/${userID}`), { orders: vendorOrders })
    .then(() => changeAdminOrderStatus(newStatus))
    .catch((error) => console.log(error));
}

function changeAdminOrderStatus(newStatus) {
  get(child(ref(db), "UsersOrders/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const usersOrders = snapshot.val();
        const userOrder = Object.keys(usersOrders).find(
          (userOrder) => usersOrders[userOrder].orderId === order.orderId
        );
        if (userOrder) {
          update(ref(db, `UsersOrders/${userOrder}`), {
            status: newStatus,
          })
            .then(() => fetchVendorOrders())
            .catch((error) => console.log(error));
        }
      }
    })
    .catch((error) => console.log(error));
}
