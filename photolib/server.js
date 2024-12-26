const express = require("express");
const fs = require("fs");
const path = require("path");

let expressServer = null; // Track the server instance globally

// Start the Express server on the specified port
function startExpressServer(port) {
    if (expressServer) {
        // Stop the existing server if already running
        expressServer.close(() => {
            console.log("Previous server stopped.");
            // Now start the new server
            createAndStartServer(port);
        });
    } else {
        // Start the server if not already running
        createAndStartServer(port);
    }
}

function createAndStartServer(port) {
    const app = express();
    const imageDirectory = ""; // Directory containing images

    // Check if the directory exists
    fs.access(imageDirectory, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(
                "Image directory does not exist or cannot be accessed:",
                imageDirectory
            );
            return;
        }
    });

    // Serve static files from the image directory
    app.use("/images", express.static(imageDirectory));

    // Endpoint to list all images
    app.get("/list-images", (req, res) => {
        fs.readdir(imageDirectory, (err, files) => {
            if (err) {
                console.error("Failed to list images:", err);
                return res.status(500).json({ error: "Failed to list images" });
            }
            // Filter for images if needed (example: only .jpg and .png)
            const imagePaths = files
                .filter((file) => file.match(/\.(jpg|jpeg|png|gif)$/i)) // Optional image extension filter
                .map((file) => `/images/${file}`);
            res.json(imagePaths);
        });
    });

    // Start the server
    expressServer = app.listen(port, () => {
        console.log(`Image server running at http://localhost:${port}/`);
    });
}

module.exports = {
    startExpressServer,
};
