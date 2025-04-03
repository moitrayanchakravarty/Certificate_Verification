// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Firebase Configuration (Replace with your actual Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyDLqOhvcJHuZS1iQVmAzHu0Ef_08jZLC84",
    authDomain: "certificateverification-385c0.firebaseapp.com",
    projectId: "certificateverification-385c0",
    storageBucket: "certificateverification-385c0.firebasestorage.app",
    messagingSenderId: "516100579750",
    appId: "1:516100579750:web:7eeae8c6f63e66cac56f67"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase initialized:", app.name); // Should log "[DEFAULT]" if successful
const db = getFirestore(app);

async function testFirestoreConnection() {
    try {
        const querySnapshot = await getDocs(collection(db, "Certificates"));
        console.log("Firestore connected. Documents found:", querySnapshot.size);
    } catch (error) {
        console.error("Error connecting to Firestore:", error);
    }
}

// Function to verify certificate
document.getElementById("verification-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form refresh

    const certId = document.getElementById("certificate_id").value.trim();
    const resultDiv = document.getElementById("result");

    if (certId === "") {
        resultDiv.innerHTML = "❌ Please enter a Certificate ID.";
        resultDiv.className = "invalid"; // Apply CSS class
        return;
    }

    try {
        const docRef = doc(db, "Certificates", certId);
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
