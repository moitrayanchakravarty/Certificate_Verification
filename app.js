// Firebase Configuration (Replace with your Firebase credentials)
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
