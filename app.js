require('dotenv').config(); // If using Node.js

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Function to verify certificate
document.getElementById("verify-btn").addEventListener("click", () => {
    const certId = document.getElementById("certificate-id").value.trim();
    const resultDiv = document.getElementById("result");

    if (certId === "") {
        resultDiv.innerHTML = "❌ Please enter a Certificate ID.";
        resultDiv.style.color = "red";
        return;
    }

    // Search for the certificate in Firestore
    db.collection("certificates").doc(certId).get()
        .then((doc) => {
            if (doc.exists) {
                resultDiv.innerHTML = `✅ Valid Certificate! <br> Name: ${doc.data().name}`;
                resultDiv.style.color = "green";
            } else {
                resultDiv.innerHTML = "❌ Invalid Certificate!";
                resultDiv.style.color = "red";
            }
        })
        .catch((error) => {
            console.error("Error verifying certificate:", error);
            resultDiv.innerHTML = "⚠️ Error connecting to database.";
            resultDiv.style.color = "orange";
        });
});
