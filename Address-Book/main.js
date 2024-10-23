import {
  getAuth,
  onAuthStateChanged,
  get,
  getDatabase,
  ref,
  child,
  update,
} from "../firebase.js";

const db = getDatabase();
let details = JSON.parse(localStorage.getItem("details"));
let addressData = {};

window.onload = () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    user ? getAddress() : window.location.replace("../Login");
  });
};

function getAddress() {
  document.getElementById("loader").style.display = "block";
  get(child(ref(db), "UsersDetails/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        document.getElementById("loader").style.display = "none";
        document.getElementById("body").innerHTML = "";
        addressData = snapshot.val();
        displayAddresses();
      }
    })
    .catch((error) => console.error(error));
}

function displayAddresses() {
  const user = addressData[details["key"]];
  if (user) {
    user["AddressBook"].forEach((address, i) => {
      const isChecked = address["switch"] ? "checked" : "";
      document.getElementById("body").innerHTML += `
        <label class="labl" id=${i}>
          <input type="radio" ${isChecked} />
          <div>
            <div class='link-body'>
              <p class="edit-link">Edit</p>
            </div>
            <div >
              ${formatAddress(address)}
            </div>
          </div>
        </label>`;
      setupAddressClick(i, user);
    });
    setupEditClicks();
  }
}

function formatAddress(address) {
  return `
    <div class="flex"><div class="title">First Name:</div><div class="info">${address.firstName}</div></div>
    <div class="flex"><div class="title">Last Name:</div><div class="info">${address.lastName}</div></div>
    <div class="flex"><div class="title">Phone:</div><div class="info">+234${address.phone}</div></div>
    <div class="flex"><div class="title">Hostel:</div><div class="info">${address.hostel}</div></div>
    <div class="flex"><div class="title">Gender:</div><div class="info">${address.gender}</div></div>
  `;
}

function setupAddressClick(index, user) {
  document.getElementById(index).onclick = (e) => {
    e.preventDefault();
    if (user.AddressBook.length > 1 && user.AddressBook[index]["switch"]) {
      toggleAddressSelection(index, user);
    }
  };
}

function toggleAddressSelection(selectedIndex, user) {
  console.log(selectedIndex);
  const updatedAddressBook = user.AddressBook.map((address, index) => ({
    ...address,
    switch: index === selectedIndex,
  }));
  console.log(updatedAddressBook);

  update(ref(db, `UsersDetails/${details["id"]}`), {
    AddressBook: updatedAddressBook,
  })
    .then(() => {
      localStorage.setItem(
        "details",
        JSON.stringify({
          ...details,
          ...user.AddressBook[selectedIndex],
        })
      );
      getAddress();
    })
    .catch((error) => console.error(error));
}

function setupEditClicks() {
  const editButtons = document.getElementsByClassName("edit-link");
  Array.from(editButtons).forEach((btn, index) => {
    btn.addEventListener("click", () => openEditForm(index));
  });
}

function openEditForm(index) {
  const address = addressData[details["key"]]["AddressBook"][index];
  document.getElementById("edit-first").value = address.firstName;
  document.getElementById("edit-last").value = address.lastName;
  document.getElementById("edit-phone").value = address.phone;
  document.getElementById("edit-hostel").value = address.hostel;
  document.getElementById("edit-gender").value = address.gender;
  document.getElementById("edit-body").style.display = "flex";
  document.getElementById("edit-loader").style.display = "none";
}

document.getElementById("close").addEventListener("click", () => {
  document.getElementById("edit-body").style.display = "none";
  clearFormFields();
});

document.getElementById("floating-btn").addEventListener("click", () => {
  clearFormFields();
  document.getElementById("edit-body").style.display = "flex";
  document.getElementById("edit-loader").style.display = "none";
});

function clearFormFields() {
  [
    "edit-first",
    "edit-last",
    "edit-phone",
    "edit-hostel",
    "edit-gender",
  ].forEach((id) => {
    document.getElementById(id).value = "";
  });
}

document.getElementById("edit-form").addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  const formValues = getFormValues();
  if (validateForm(formValues)) {
    document.getElementById("edit-loader").style.display = "block";
    updateAddress(formValues);
  } else {
    alert("Fill all fields");
  }
}

function getFormValues() {
  return {
    firstName: document.getElementById("edit-first").value,
    lastName: document.getElementById("edit-last").value,
    phone: document.getElementById("edit-phone").value,
    hostel: document.getElementById("edit-hostel").value,
    gender: document.getElementById("edit-gender").value,
  };
}

function validateForm({ firstName, lastName, phone, hostel, gender }) {
  return (
    firstName && lastName && phone && hostel !== "Hostel" && gender !== "Gender"
  );
}

function updateAddress(formValues) {
  const user = addressData[details["key"]];
  user.AddressBook.push({
    ...formValues,
    switch: false,
  });

  update(ref(db, `UsersDetails/${details["key"]}`), {
    AddressBook: user.AddressBook,
  })
    .then(() => {
      document.getElementById("edit-body").style.display = "none";
      getAddress();
    })
    .catch((error) => console.error(error));
}
