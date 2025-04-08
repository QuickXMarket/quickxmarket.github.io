import {
  ref,
  set,
  get,
  child,
  update,
  getDatabase,
  getAuth,
} from "../firebase.js";

let userId, cartList, products, totalPrice;
const auth = getAuth();

let userOrder = {};
let vendorOrderDetails = {};
let userDetails = JSON.parse(localStorage.getItem("details"));

const db = getDatabase();

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
      // window.location = "../";
    })
    .catch((error) => console.error("Error uploading user order:", error));
}

function uploadAdminOrder(accountId, productList, totalCost) {
  cartList = JSON.parse(localStorage.getItem("cart"));
  totalPrice = totalCost;
  userId = accountId;
  products = productList;

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
    userId: accountId,
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
          const updatePromises = [];

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

            const updatePromise = update(
              ref(db, `VendorsDetails/${vendorId}`),
              vendorOrderDetails
            );
            updatePromises.push(updatePromise);
          });

          // Wait for all updates to complete, then add user order
          Promise.all(updatePromises)
            .then(() => {
              addUserOrder(orderId);
            })
            .catch((error) => {
              console.error("Error updating one or more vendor orders:", error);
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

export default uploadAdminOrder;

const sendEmails = async () => {
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  const res = await fetch("http://localhost:3001/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const msg = await res.text();
  console.log(msg);
};
