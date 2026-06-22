// ===============================
// Firebase CDN imports
// ===============================
console.log("APP.JS LOADED SUCCESSFULLY");
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";


// ===============================
// Firebase Config
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyBIjn9EEr9hJeSoDWPun39w1MAeY5BvMos",
  authDomain: "skill-mate-ai-b5b8f.firebaseapp.com",
  projectId: "skill-mate-ai-b5b8f",
  storageBucket: "skill-mate-ai-b5b8f.appspot.com",
  messagingSenderId: "720243016023",
  appId: "1:720243016023:web:64ee8df4443844a469fe12"
};


// ===============================
// Initialize Firebase
// ===============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ===============================
// Google Apps Script URL
// ===============================
const GOOGLE_SCRIPT_URL =
 "https://script.google.com/macros/s/AKfycbyhIhGvSDqoxfHe26hA5hvaMReqxxd_3b8WS-qv9JInCchsvslpUfLDJj_F51q2jEbF9Q/exec;"


// ===============================
// Send data to Google Sheets
// ===============================
async function sendToGoogleSheet(uid, name, email) {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uid,
        name,
        email
      })
    });

    console.log("Status:", response.status);

    const result = await response.text();
    console.log("Apps Script Response:", result);

  } catch (error) {
    console.error("Google Sheet Error:", error);
  }
}


// ===============================
// SIGNUP FUNCTION
// ===============================
window.signup = async function () {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  try {
    // basic validation
    if (!name || !email || !password) {
      msg.innerText = "Please fill all fields";
      msg.style.color = "red";
      return;
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: new Date()
    });

    // Send to Google Sheets (non-blocking safety handled)
    await sendToGoogleSheet(user.uid, name, email);

    // Success message
    msg.innerText = "Signup successful! Redirecting...";
    msg.style.color = "green";

    // Redirect AFTER everything completes
    setTimeout(() => {
      window.location.href = "service.html";
    }, 1000);

  } catch (error) {
    console.error("Signup error:", error);

    msg.innerText = error.message;
    msg.style.color = "red";
  }
};
