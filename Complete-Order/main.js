import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  getAuth,
  onAuthStateChanged,
} from "../firebase.js";

const db = getDatabase();
let cartList = [];
let userOrder = {};
let vendorOrderDetails = {};
let totalPrice = 0;
let userId;
const deliveryCharge = 100;

const userDetails = JSON.parse(localStorage.getItem("details"));
cartList = JSON.parse(localStorage.getItem("cart"));

window.onload = function () {
  if (!cartList || cartList.length === 0) {
    window.location = "../My-Cart/";
  } else {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userId = user.uid;
        loadCartDetails();
      } else {
        window.location.replace("../Login");
      }
    });
  }
};

function loadCartDetails() {
  document.getElementById("body").style.display = "none";
  document.getElementById("loader").style.display = "block";

  const dbRef = ref(db);
  get(child(dbRef, "ProductsDetails/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        document.getElementById("loader").style.display = "none";
        document.getElementById("body").style.display = "block";

        let productData = snapshot.val();

        cartList.forEach((item) => {
          const productKey = Object.keys(productData).find(
            (key) => productData[key]["code"] === item["code"]
          );
          if (productKey) {
            const product = productData[productKey];
            const itemPrice = product["price"];
            const itemQuantity = item["amount"];
            totalPrice += itemPrice * itemQuantity;
          }
        });

        displayOrderSummary();
      }
    })
    .catch((error) => console.error("Error loading cart details:", error));
}

function displayOrderSummary() {
  const intlFormatter = new Intl.NumberFormat("en-US");
  const totalAmount = totalPrice + deliveryCharge;

  document.getElementById("subtotal").textContent = `₦${intlFormatter.format(
    totalPrice
  )}`;
  document.getElementById("name").textContent = userDetails["name"];
  document.getElementById("phone").textContent = userDetails["phone"];
  document.getElementById("hostel").textContent = userDetails["hostel"];
  document.getElementById("total").textContent = `₦${intlFormatter.format(
    totalAmount
  )}`;
  sessionStorage.setItem("amount", totalAmount);
}

// function uploadOrderAdmin() {
//
//   addUserOrder(orderId);
// }

function addUserOrder(orderId) {
  const dbRef = ref(db);
  get(child(dbRef, `UsersDetails/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const user = snapshot.val();
        const userOrders = user.orders || [];

        const date = Date.now();
        // const formattedDate = `${date.getHours()}:${date.getMinutes()}, ${date.getDate()}/${
        //   date.getMonth() + 1
        // }/${date.getFullYear()}`;

        userOrder = [
          ...userOrders,
          {
            orderId: orderId,
            status: "Confirming Request",
            date: date,
            orders: cartList,
            total: totalPrice - deliveryCharge,
          },
        ];

        uploadUserOrder();
      }
    })
    .catch((error) => console.error("Error fetching user details:", error));
}

function uploadUserOrder() {
  update(ref(db, `UsersDetails/${userId}`), { orders: userOrder })
    .then(() => {
      localStorage.removeItem("cart");
      window.location = "../";
    })
    .catch((error) => console.error("Error uploading user order:", error));
}

function uploadAdminOrder() {
  const orderId = generateRandomId(7);
  const date = Date.now();
  // const formattedDate = `${date.getHours()}:${date.getMinutes()}, ${date.getDate()}/${
  //   date.getMonth() + 1
  // }/${date.getFullYear()}`;

  const adminOrderDetails = {
    name: userDetails["name"],
    hostel: userDetails["hostel"],
    userId: userId,
    phone: userDetails["phone"],
    orderId: orderId,
    status: "Confirming Request",
    date: date,
    orders: cartList,
    total: totalPrice - deliveryCharge,
  };

  const orderKey = generateRandomId(19);
  set(ref(db, `UsersOrders/${orderKey}`), adminOrderDetails)
    .then(() => uploadVendorOrder(orderId))
    .catch((error) => console.error("Error uploading admin order:", error));
}

function uploadVendorOrder(orderId) {
  const dbRef = ref(db);
  get(child(dbRef, "VendorsDetails/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const vendors = snapshot.val();
        const vendorOrders = {};
        cartList.forEach((item) => {
          const vendorKey = Object.keys(vendors).find((vendor) =>
            vendors[vendor].products.includes(item.code)
          );
          if (!vendorKey) return;
          if (!vendorOrders[vendorKey]) {
            vendorOrders[vendorKey] = [];
          }
          vendorOrders[vendorKey].push(item);
        });

        Object.keys(vendorOrders).forEach((vendorId) => {
          const vendorOrder = vendorOrders[vendorId];
          const previousOrders = vendors[vendorId].order || [];

          vendorOrderDetails = {
            orders: [
              ...previousOrders,
              {
                date: Date.now(),
                orderId: orderId,
                orders: vendorOrder,
                total: totalPrice - deliveryCharge,
              },
            ],
          };

          update(ref(db, `VendorsDetails/${vendorId}`), vendorOrderDetails)
            .then(() => addUserOrder(orderId))
            .catch((error) =>
              console.error("Error updating vendor order:", error)
            );
        });
      }
    })
    .catch((error) => console.error("Error fetching vendor details:", error));
}

function generateRandomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
}

export { uploadAdminOrder };
