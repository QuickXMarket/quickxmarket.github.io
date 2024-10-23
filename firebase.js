import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYxeN5MYVPDLNO2rmAd4ac1Bm3CzJhcpM",
  authDomain: "quickmarkert.firebaseapp.com",
  databaseURL: "https://quickmarkert-default-rtdb.firebaseio.com",
  projectId: "quickmarkert",
  storageBucket: "quickmarkert.appspot.com",
  messagingSenderId: "204278904584",
  appId: "1:204278904584:web:9000c97e001e7104a4debd",
  measurementId: "G-VKQ30K962R",
};

// Initialize Firebase

import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  push,
  remove,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-database.js";

import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export {
  getAuth,
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  remove,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  storageRef,
  getStorage,
  uploadBytes,
  getDownloadURL,
  storage,
};
