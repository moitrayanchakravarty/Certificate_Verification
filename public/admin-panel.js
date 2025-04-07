import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Firebase configuration object containing the keys and identifiers for your Firebase project.
// These values are specific to your Firebase project and are used to initialize the Firebase app.
const firebaseConfig = {
    apiKey: "AIzaSyDLqOhvcJHuZS1iQVmAzHu0Ef_08jZLC84",
    authDomain: "certificateverification-385c0.firebaseapp.com",
    projectId: "certificateverification-385c0",
    storageBucket: "certificateverification-385c0.firebasestorage.app",
    messagingSenderId: "516100579750",
    appId: "1:516100579750:web:7eeae8c6f63e66cac56f67"
};

// Initialize the Firebase app using the configuration object.
// This sets up the connection between your application and Firebase services.
const app = initializeApp(firebaseConfig);

// Initialize Firestore, the Firebase database service, for the app.
// Firestore will be used to store and retrieve data for the "Certificates" collection.
const db = getFirestore(app);

// Add an event listener to the form with the ID "add-candidate-form".
// This listener will trigger when the form is submitted.
document.getElementById("add-candidate-form").addEventListener("submit", async (event) => {
    // Prevent the default form submission behavior (which would reload the page).
    event.preventDefault();

    // Retrieve the candidate's name from the input field with the ID "name".
    // The `trim()` method removes any leading or trailing whitespace.
    const name = document.getElementById("name").value.trim();

    // Retrieve the candidate's email from the input field with the ID "email".
    // The `trim()` method ensures no extra spaces are included.
    const email = document.getElementById("email").value.trim();

    // Get the result display element where success or error messages will be shown.
    const resultDiv = document.getElementById("add-result");

    const issuedDate = new Date();
    const formattedDate = `${String(issuedDate.getDate()).padStart(2, '0')}-${String(issuedDate.getMonth() + 1).padStart(2, '0')}-${issuedDate.getFullYear()}`;

    try {
        const docRef = doc(collection(db, "Certificates")); // Create a new document reference
        const certificateId = docRef.id; // Use Firebase-generated document ID

        const certificateLink = `https://codeclashjec.netlify.app/certificates/${certificateId}`;

        // Store the certificate data in Firestore
        await setDoc(docRef, {
            certificate_id: certificateId,
            name: name,
            email: email,
            issued_date: formattedDate,
            certificate_link: certificateLink
        });

        // Send the certificate ID and other details to the server
        const response = await fetch("/generate-certificate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, certificateId, issuedDate: formattedDate })
        });

        if (!response.ok) {
            throw new Error("Failed to generate certificate");
        }

        const data = await response.json();
        console.log(data.message);

        resultDiv.textContent = `✅ Candidate added successfully! Certificate ID: ${certificateId}`;
    } catch (error) {
        // If an error occurs during the operation, log it to the console.

        // Display an error message to the user indicating the operation failed.
        console.error("Error:", error);

        // Display an error message to the user indicating the operation failed.
        resultDiv.textContent = "❌ Failed to add candidate. Please try again.";
    }
});