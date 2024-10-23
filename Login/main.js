import {
  getDatabase,
  ref,
  get,
  child,
  update,
  getAuth,
  signInWithEmailAndPassword,
} from "../firebase.js";

const db = getDatabase();
let email,
  password,
  userDetails = {};
const paymentForm = document.getElementById("boxes");

paymentForm.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  getCredentials();
  signInUser();
  showLoader(true);
}

function getCredentials() {
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;
}

function signInUser() {
  if (email && password) {
    const auth = getAuth();
    showLoader(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        fetchUserData(userCredential.user.uid);
      })
      .catch((error) => {
        alert(error);
        showLoader(false);
      });
  }
}

function fetchUserData(userId) {
  const dbRef = ref(db);
  get(child(dbRef, "UsersDetails/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        processUserData(snapshot.val(), userId);
      }
    })
    .catch(handleError);
}

function processUserData(data, userId) {
  const userEntries = Object.values(data);
  const user = userEntries.find((user) => user.id === userId);
  const currentAddressBook = user.AddressBook.find(
    (AddressBook) => AddressBook.switch
  );

  userDetails = {
    AccountType: user.AccountType,
    email: user.email,
    name: `${currentAddressBook[`firstName`]} ${
      currentAddressBook[`lastName`]
    }`,
    hostel: currentAddressBook[`hostel`],
    gender: currentAddressBook[`gender`],
    phone: currentAddressBook[`phone`],
    login: "yes",
    key: user.id,
  };
  console.log(userDetails);
  localStorage.setItem("details", JSON.stringify(userDetails));
  loadCartData(user);
}

function uploadCartData(newCart, user) {
  if (newCart && newCart.length > 0) {
    update(ref(db, `UsersDetails/${user.id}`), { cart: newCart })
      .then(() => {
        localStorage.setItem("cart", JSON.stringify(newCart));
        window.location = "../";
      })
      .catch(console.log);
  } else {
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.location = "../";
  }
}

function loadCartData(user) {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const userCart = user.cart || [];

  const filteredUserCart = userCart.filter(
    (product) => !cartItems.some((item) => item.id === product.id)
  );

  const updatedCart = [...filteredUserCart, ...cartItems];

  uploadCartData(updatedCart, user);
}

function handleError(error) {
  if (error.message.includes("Client is offline")) {
    alert("Please Check Your Network Connection");
    showLoader(false);
  } else {
    console.error(error);
  }
}

function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
  document.getElementById("email").setAttribute("disabled", show);
  document.getElementById("password").setAttribute("disabled", show);
  document.getElementById("submit").setAttribute("disabled", show);
}

document.getElementById("toggle").onclick = () => {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.getElementById("toggle");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.src = "../images/ic_visibility_black.png";
  } else {
    passwordInput.type = "password";
    toggleIcon.src = "../images/ic_visibility_off_black.png";
  }
};
