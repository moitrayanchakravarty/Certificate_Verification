import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDLqOhvcJHuZS1iQVmAzHu0Ef_08jZLC84",
    authDomain: "certificateverification-385c0.firebaseapp.com",
    projectId: "certificateverification-385c0",
    storageBucket: "certificateverification-385c0.firebasestorage.app",
    messagingSenderId: "516100579750",
    appId: "1:516100579750:web:7eeae8c6f63e66cac56f67"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("admin-login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorDiv = document.getElementById("login-error");

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Admin logged in:", userCredential.user.email);
        window.location.href = "admin-panel.html"; // Redirect to admin panel
    } catch (error) {
        console.error("Login failed:", error.message);
        errorDiv.textContent = "❌ Login failed. Please check your credentials.";
    }
});