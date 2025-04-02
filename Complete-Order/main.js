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
import getThemeColor from "../Utilities/ColorTheme.js";

const db = getDatabase();
let cartList = [];
let userOrder = {};
let vendorOrderDetails = {};
let totalPrice = 0;
let totalAmount = 0;
let userId;
let products;
const deliveryCharge = 100;

const userDetails = JSON.parse(localStorage.getItem("details"));
cartList = JSON.parse(localStorage.getItem("cart"));

window.onload = () => {
  getThemeColor();
  if (!cartList || cartList.length === 0) {
    window.location = "../My-Cart/";
  } else {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user && userDetails) {
        userId = user.uid;
        if (userDetails.hostel === "None") {
          alert("Please select your hostel before proceeding.");
          window.location = "../Address-Book/";
        } else loadCartDetails();
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

        products = snapshot.val();

        cartList.forEach((item) => {
          const productKey = Object.keys(products).find(
            (key) => products[key]["code"] === item["code"]
          );
          if (productKey) {
            const product = products[productKey];
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
  totalAmount = totalPrice + deliveryCharge;

  document.getElementById("subtotal").textContent = `₦${intlFormatter.format(
    totalPrice
  )}`;
  document.getElementById("name").textContent = userDetails["name"];
  document.getElementById("phone").textContent = userDetails["phone"];
  document.getElementById("hostel").textContent = userDetails["hostel"];
  document.getElementById("total").textContent = `₦${intlFormatter.format(
    totalAmount
  )}`;
  // sessionStorage.setItem("amount", totalAmount);
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

        const orders = [];

        cartList.forEach((item) => {
          const productData = Object.values(products).find(
            (product) => product.code === item.code
          );
          orders.push({
            ...item,
            vendor: productData.vendorID,
            status: "Confirming Request",
          });
        });

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
            orders,
            total: totalPrice,
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

  const orders = [];

  cartList.forEach((item) => {
    const productData = Object.values(products).find(
      (product) => product.code === item.code
    );
    orders.push({
      ...item,
      vendor: productData.vendorID,
      status: "Confirming Request",
    });
  });

  const adminOrderDetails = {
    name: userDetails["name"],
    hostel: userDetails["hostel"],
    userId: userId,
    phone: userDetails["phone"],
    orderId: orderId,
    status: "Confirming Request",
    date: date,
    orders,
    total: totalPrice,
  };

  // const orderKey = generateRandomId(19);
  set(ref(db, `UsersOrders/${orderId}`), adminOrderDetails)
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
          const vendorKey = Object.keys(vendors).find((vendor) => {
            if (!vendors[vendor].products) return false;
            return vendors[vendor].products.includes(item.code);
          });

          if (!vendorKey) return;
          if (!vendorOrders[vendorKey]) {
            vendorOrders[vendorKey] = [];
          }
          vendorOrders[vendorKey].push(item);
        });

        if (Object.keys(vendorOrders).length > 0) {
          Object.keys(vendorOrders).forEach((vendorId) => {
            const vendorOrder = vendorOrders[vendorId];
            const previousOrders = vendors[vendorId].orders || [];
            let vendorTotalPrice = 0;

            vendorOrder.forEach((item) => {
              const productKey = Object.keys(products).find(
                (key) => products[key]["code"] === item["code"]
              );
              if (productKey) {
                const product = products[productKey];
                const itemPrice = product["price"];
                const itemQuantity = item["amount"];
                vendorTotalPrice += itemPrice * itemQuantity;
              }
            });

            vendorOrderDetails = {
              orders: [
                ...previousOrders,
                {
                  date: Date.now(),
                  orderId: orderId,
                  orders: vendorOrder,
                  total: vendorTotalPrice,
                  status: "Confirming Request",
                  userId: userId,
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

function payWithPaystack(e) {
  e.preventDefault();
  const userDetails = JSON.parse(localStorage.getItem("details"));

  var handler = PaystackPop.setup({
    key: "pk_live_8cd17500e1d21d97dbb4e7db77e58daa054d8b1d",
    email: userDetails["email"],
    amount: totalAmount * 100,

    callback: function (response) {
      let message = "Payment complete! Reference: " + response.reference;

      fetch(
        "https://api.paystack.co/transaction/verify/" + response.reference,
        {
          headers: {
            Authorization:
              "Bearer sk_live_07ddc6fa4eb92cb9b7458f7405f93c9e0d588179",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          var status = data["data"]["status"];
          if (status === "success") {
            var s_email = data["data"]["customer"]["email"];
            var reference = data["data"]["reference"];
            var date = new Date();
            var date_time =
              date.getMonth() +
              1 +
              "/" +
              date.getDate() +
              "/" +
              date.getFullYear() +
              " " +
              date.getHours() +
              ":" +
              date.getMinutes();

            // Update UI and trigger upload
            document.getElementById("body").style.display = "none";
            document.getElementById("loader").style.display = "block";
            uploadAdminOrder();
          } else {
            console.log("Payment verification failed:", response);
          }
        })
        .catch((error) => {
          console.error("Error verifying payment:", error);
        });
    },

    onClose: function () {
      alert("Transaction cancelled");
    },
  });
  handler.openIframe();
}

const paymentForm = document.getElementById("paymentForm");
paymentForm.addEventListener("submit", payWithPaystack, false);
