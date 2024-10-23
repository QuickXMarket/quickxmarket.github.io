import {
  getDatabase,
  ref,
  set,
  getAuth,
  createUserWithEmailAndPassword,
} from "../firebase.js";

const db = getDatabase();

var first,
  last,
  hostel,
  code,
  re_password,
  email,
  password,
  gender,
  hostel,
  phone;

const paymentForm = document.getElementById("boxes");

paymentForm.addEventListener("submit", submit, false);
var datakey = "-M";

function submit(e) {
  e.preventDefault();
  Ready();
  if (
    first !== "" &&
    last !== "" &&
    email !== "" &&
    password !== "" &&
    phone !== "" &&
    gender !== "Gender" &&
    hostel !== "Hostel"
  ) {
    if (password === re_password) {
      sign_up();
      console.log("here");
      document.getElementById("loader").setAttribute("style", "display:block");
    } else {
      alert("Password does not Match");
    }
  } else {
    alert("Fill all Fields");
  }
}

function sign_up() {
  console.log("in");
  const auth = getAuth();
  console.log("sign");
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      InsertData(user);
    })
    .catch((error) => {
      alert(error);
      document.getElementById("loader").setAttribute("style", "display:none");
    });
}

function Ready() {
  first = document.getElementById("first").value;
  last = document.getElementById("last").value;
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;
  re_password = document.getElementById("re-password").value;
  phone = document.getElementById("phone").value;
  gender = document.getElementById("gender").value;
  hostel = document.getElementById("hostel").value;
}

function InsertData(user) {
  var cart_list = JSON.parse(localStorage.getItem("cart"));

  if (cart_list !== null && cart_list.length !== 0) {
    var cart_length = cart_list.length;
    var cart_details = new Object();
    cart_details["cart_num"] = cart_length;

    for (let i = 1; i <= cart_length; i++) {
      var position = i - 1;
      cart_details["cart_code"] = {
        cart_code: cart_list[position]["code"],
        cart_num: cart_list[position]["number"],
      };
    }
  }
  
  set(ref(db, "UsersDetails/" + user.uid), {
    AccountType: "user",
    AddressBook: [
      {
        firstName: first,
        lastName: last,
        gender: gender,
        phone: phone,
        hostel: hostel,
        switch: true,
      },
    ],
    cart: cart_details || [],
    email: email,
    id: user.uid,
  })
    .then(() => {
      set_info();
    })
    .catch((error) => {
      console.log(error);
    });
}

function set_info() {
  var details = new Object();
  details = {
    AccountType: "user",
    user: code,
    key: datakey,
    email: email,
    first: first,
    name: first + " " + last,
    hostel: hostel,
    gender: gender,
    phone: phone,
    login: "yes",
  };
  localStorage.setItem("details", JSON.stringify(details));
  window.location = "../";
}

var toogle = document.getElementById("toogle");
toogle.onclick = function () {
  var x = document.getElementById("password");
  var r = document.getElementById("re-password");
  if (x.type === "password") {
    x.type = "text";
    r.type = "text";
    toogle.src = "../images/ic_visibility_black.png";
  } else {
    x.type = "password";
    r.type = "password";
    toogle.src = "../images/ic_visibility_off_black.png";
  }
};
