import {
  getDatabase,
  ref,
  set,
  getAuth,
  createUserWithEmailAndPassword,
} from "../firebase.js";

const db = getDatabase();

let userFormData = {
  first: "",
  last: "",
  email: "",
  password: "",
  re_password: "",
  phone: "",
  gender: "",
  hostel: "",
};

const paymentForm = document.getElementById("boxes");
paymentForm.addEventListener("submit", handleSubmit, false);

function handleSubmit(event) {
  event.preventDefault();
  gatherFormData();

  const { first, last, email, password, re_password, phone, gender, hostel } =
    userFormData;

  if (validateForm({ first, last, email, password, phone, gender, hostel })) {
    if (password === re_password) {
      showLoader(true);
      signUpUser();
    } else {
      alert("Passwords do not match");
    }
  } else {
    alert("Please fill in all fields");
  }
}

function gatherFormData() {
  userFormData = {
    first: document.getElementById("first").value,
    last: document.getElementById("last").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    re_password: document.getElementById("re-password").value,
    phone: document.getElementById("phone").value,
    gender: document.getElementById("gender").value,
    hostel: document.getElementById("hostel").value,
  };
}

function validateForm({ first, last, email, password, phone, gender, hostel }) {
  return (
    first &&
    last &&
    email &&
    password &&
    phone &&
    gender !== "Gender" &&
    hostel !== "Hostel"
  );
}

function signUpUser() {
  const { email, password } = userFormData;
  const auth = getAuth();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      insertUserData(user);
    })
    .catch((error) => {
      alert(error.message);
      showLoader(false);
    });
}

function insertUserData(user) {
  const cartList = JSON.parse(localStorage.getItem("cart")) || [];

  set(ref(db, `UsersDetails/${user.uid}`), {
    AccountType: "user",
    AddressBook: [
      {
        firstName: userFormData.first,
        lastName: userFormData.last,
        gender: userFormData.gender,
        phone: userFormData.phone,
        hostel: userFormData.hostel,
        switch: true,
      },
    ],
    cart: cartList,
    email: userFormData.email,
    id: user.uid,
  })
    .then(setUserInfo)
    .catch((error) => {
      console.error(error);
      showLoader(false);
    });
}

function setUserInfo() {
  const details = {
    AccountType: "user",
    email: userFormData.email,
    first: userFormData.first,
    name: `${userFormData.first} ${userFormData.last}`,
    hostel: userFormData.hostel,
    gender: userFormData.gender,
    phone: userFormData.phone,
    login: "yes",
  };

  localStorage.setItem("details", JSON.stringify(details));
  window.location = "../";
}

document.getElementById("toogle").onclick = function () {
  togglePasswordVisibility();
};

function togglePasswordVisibility() {
  const passwordField = document.getElementById("password");
  const rePasswordField = document.getElementById("re-password");
  const toggleIcon = document.getElementById("toogle");

  const isPasswordVisible = passwordField.type === "password";

  passwordField.type = isPasswordVisible ? "text" : "password";
  rePasswordField.type = isPasswordVisible ? "text" : "password";
  toggleIcon.src = isPasswordVisible
    ? "../images/ic_visibility_black.png"
    : "../images/ic_visibility_off_black.png";
}

function showLoader(show) {
  const loader = document.getElementById("loader");
  loader.style.display = show ? "block" : "none";

  const fields = [
    "first",
    "last",
    "email",
    "password",
    "re-password",
    "phone",
    "gender",
    "hostel",
    "submit",
  ];
  fields.forEach((field) => {
    const element = document.getElementById(field);
    if (show) {
      element.setAttribute("disabled", true);
    } else {
      element.removeAttribute("disabled");
    }
  });
}
