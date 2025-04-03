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

    // Format the current date as "DD-MM-YYYY" to store it as the issued date.
    // This ensures the date is human-readable and follows the desired format.
    const issuedDate = new Date(); // Get the current date and time.
    const formattedDate = `${String(issuedDate.getDate()).padStart(2, '0')}-${String(issuedDate.getMonth() + 1).padStart(2, '0')}-${issuedDate.getFullYear()}`;
    const certificateId = `${Date.now()}`;

    try {
        // Generate a new document reference in the "Certificates" collection.
        // The `doc()` function creates a reference with an auto-generated unique ID.
        const docRef = doc(collection(db, "Certificates"));

        // Use the `setDoc()` function to create a new document in Firestore.
        // The document will include the following fields:
        // - certificate_id: The auto-generated document ID (stored as a string).
        // - name: The candidate's name entered in the form.
        // - email: The candidate's email entered in the form.
        // - issued_date: The formatted date when the certificate was issued (stored as a string).
        await setDoc(docRef, {
            certificate_id: docRef.id, // Auto-generated document ID (string).
            name: name,               // Candidate's name (string).
            email: email,             // Candidate's email (string).
            issued_date: formattedDate // Formatted issued date (string).
        });

        // Send a request to the server to generate the certificate
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

        // Display a success message to the user, including the generated certificate ID.
        resultDiv.textContent = `✅ Candidate added successfully! Certificate ID: ${docRef.id}`;
    } catch (error) {
        // If an error occurs during the operation, log it to the console.
        console.error("Error:", error);

        // Display an error message to the user indicating the operation failed.
        resultDiv.textContent = "❌ Failed to add candidate. Please try again.";
    }
});