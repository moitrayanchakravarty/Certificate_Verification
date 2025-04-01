// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Firebase Configuration (Replace with your actual Firebase config)
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to verify certificate
document.getElementById("verification-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form refresh

    const certId = document.getElementById("certificate-id").value.trim();
    const resultDiv = document.getElementById("result");

    if (certId === "") {
        resultDiv.innerHTML = "❌ Please enter a Certificate ID.";
        resultDiv.className = "invalid"; // Apply CSS class
        return;
    }

    try {
        const docRef = doc(db, "certificates", certId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            resultDiv.innerHTML = `✅ Valid Certificate! <br> <strong>Name:</strong> ${docSnap.data().name}`;
            resultDiv.className = "valid"; // Apply CSS class
        } else {
            resultDiv.innerHTML = "❌ Invalid Certificate!";
            resultDiv.className = "invalid"; // Apply CSS class
        }
    } catch (error) {
        console.error("Error verifying certificate:", error);
        resultDiv.innerHTML = "⚠️ Error connecting to database.";
        resultDiv.className = "error"; // Apply CSS class
    }
});
