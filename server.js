import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve favicon.ico from the root directory
app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(__dirname, "favicon.ico"));
});

// Example route
app.get("/", (req, res) => {
    res.send("Welcome to the Certificate Verification API!");
});

// Route to handle certificate generation
app.post("/generate-certificate", (req, res) => {
    const { name, certificateId, issuedDate } = req.body;

    if (!name || !certificateId || !issuedDate) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const command = `python generate_certificate.py "${name}" "${certificateId}" "${issuedDate}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            return res.status(500).json({ error: "Failed to generate certificate" });
        }
        if (stderr) {
            console.error(`Python script error: ${stderr}`);
            return res.status(500).json({ error: "Error in certificate generation" });
        }

        console.log(`Python script output: ${stdout}`);
        res.json({ message: "Certificate generated successfully" });
    });
});

// Example route for API
app.post("/verify-certificate", (req, res) => {
    // Your certificate verification logic here
    res.json({ message: "Certificate verification endpoint" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
