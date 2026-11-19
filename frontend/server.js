const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:5000";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "express-frontend" });
});

app.post("/submit", async (req, res) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: req.body.name,
                email: req.body.email
            })
        });

        const result = await response.json();

        if (!response.ok) {
            return res.status(response.status).send(`
                <h2>Submission failed</h2>
                <p>${result.error}</p>
                <a href="/">Go back</a>
            `);
        }

        res.send(`
            <h2>${result.message}</h2>
            <p>Name: ${result.name}</p>
            <p>Email: ${result.email}</p>
            <p>Processed by Flask backend</p>
            <a href="/">Register another user</a>
        `);

    } catch (error) {
        console.error("Backend connection error:", error.message);
        res.status(502).send("Unable to connect to Flask backend.");
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express frontend running on port ${PORT}`);
});
