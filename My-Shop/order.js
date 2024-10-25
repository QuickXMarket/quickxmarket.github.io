import { getDatabase, get, update, child, ref } from "../firebase.js";

const formatCurrency = (num) =>
  "₦" + new Intl.NumberFormat("en-US").format(num);

function toggleVisibility(element1Id, element2Id) {
  const el1 = document.getElementById(element1Id);
  const el2 = document.getElementById(element2Id);
  if (!el1.classList.contains("visible")) {
    el1.classList.toggle("visible");
    el2.classList.toggle("visible");
  }
}

// Set up event listeners for options
Object.values(document.getElementsByClassName("option_view")).forEach(
  (element, index) => {
    element.addEventListener("click", () => {
      Object.values(document.getElementsByClassName("option_select")).forEach(
        (select) => (select.style.backgroundColor = "#000137")
      );
      document.getElementsByClassName("option_select")[
        index
      ].style.backgroundColor = "white";

      if (index === 0) toggleVisibility("itemList", "orderList");
      else if (index === 1) toggleVisibility("orderList", "itemList");
    });
  }
);

export function getVendorOrders(vendorDetails) {
  const orderListEl = document.getElementById("orderList");
  if (!vendorDetails.orders) return;

  const vendorOrders = Object.values(vendorDetails.orders);
  if (vendorOrders.length > 0) {
    vendorOrders.forEach((order) => {
      const productURL = new URL(
        `${window.location.protocol}//${window.location.host}/My-Shop/Products/`
      );
      productURL.searchParams.append("order", order.orderId);

      orderListEl.innerHTML += `
        <div class="order_view" >
        <a href = ${productURL}>
         
          <div class="flex">
            <div><img class="order_img" src="../images/PngItem_212128 (2).png" /></div>
        <div class="flex">
            <div class="order_txt">Order</div>
            <div class="order_no">${order.orderId}</div>
          </div>
              <div class="order_status">
             <!-- <button class="statusBtn">${
               order.status === "Confirming Request"
                 ? "Confirm Request"
                 : "Confirm Delivery"
             }</button>-->
            </div>
          </div>
          <div class="flex">
            <div class="order_price">Total: ${formatCurrency(order.total)}</div>
          <div class="order_date">${formatDate(order.date)}</div>
          </div>
          </a>
        </div>`;
    });

    document.querySelectorAll(".statusBtn").forEach((button) => {
      button.addEventListener("click", handleStatusUpdate);
    });
  }
}

function handleStatusUpdate(e) {
  e.preventDefault();
  const status = e.target.innerText;
  if (status === "Confirm Request") {
    alert("Request confirmed");
  }
}

function changeUserOrderStatus(newStatus, orderDetails) {
  get(child(ref(db), "UsersDetails/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userList = snapshot.val();
        Object.values(userList).forEach((userDetails) => {
          if (userDetails.code === orderDetails.user) {
            const orders = userDetails.orders;
            Object.values(orders).forEach((order, index) => {
              if (order.order === orderDetails.order) {
                const updatedOrder = {
                  orders: { [`Order${index + 1}`]: { status: newStatus } },
                };
                update(ref(db, `UsersDetails/${userDetails.key}`), updatedOrder)
                  .then(() => changeVendorOrderStatus(newStatus, orderDetails))
                  .catch((error) => console.log(error));
              }
            });
          }
        });
      }
    })
    .catch((error) => console.log(error));
}

// Change vendor order status
function changeVendorOrderStatus(newStatus, orderDetails, vendorDetails) {
  const orders = vendorDetails.orders;
  Object.values(orders).forEach((order, index) => {
    if (order.order === orderDetails.order) {
      const updatedOrder = {
        orders: { [`Order${index + 1}`]: { status: newStatus } },
      };
      update(ref(db, `Vendor/${vendorDetails.key}`), updatedOrder)
        .then(() => console.log("Vendor order status updated"))
        .catch((error) => console.log(error));
    }
  });
}

// Change admin order status
function changeAdminOrderStatus(newStatus, orderDetails) {
  get(child(ref(db), "UsersOrders/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const orderList = snapshot.val();
        Object.values(orderList).forEach((userDetails) => {
          if (userDetails.num === orderDetails.num) {
            const updatedOrder = { orders: { status: newStatus } };
            update(ref(db, `UsersOrders/${userDetails.key}`), updatedOrder)
              .then(() => changeVendorOrderStatus(newStatus, orderDetails))
              .catch((error) => console.log(error));
          }
        });
      }
    })
    .catch((error) => console.log(error));
}

function formatDate(timestamp) {
  const date = new Date(timestamp);

  const padToTwoDigits = (num) => num.toString().padStart(2, "0");

  const formattedDate = `${padToTwoDigits(date.getHours())}:${padToTwoDigits(
    date.getMinutes()
  )}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  return formattedDate;
}
