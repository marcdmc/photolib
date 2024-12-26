const fs = require("fs");
const path = require("path");
const glob = require("glob");
const { ipcRenderer } = require("electron");

ipcRenderer.on("initialize-main-window", () => {
    // Get saved image path
    ipcRenderer.invoke("get-image-path").then((savedPath) => {
        if (savedPath) {
            updateImages(savedPath);
        }
    });

    // MARK: Settings
    const settingsIcon = document.getElementById("settings-icon");
    const settingsModal = document.getElementById("settings-modal");
    const closeModalButton = document.getElementById("modal-close");
    const saveSettingsButton = document.getElementById("save-settings");
    const imagePathInput = document.getElementById("image-path");

    // Open settings modal
    settingsIcon.addEventListener("click", () => {
        settingsModal.style.display = "flex";
        // Read saved image path
        ipcRenderer.invoke("get-image-path").then((savedPath) => {
            if (savedPath) {
                imagePathInput.value = savedPath;
            }
        });
    });

    // Close settings modal
    closeModalButton.addEventListener("click", () => {
        settingsModal.style.display = "none";
    });

    // Save settings
    saveSettingsButton.addEventListener("click", () => {
        const imagePath = imagePathInput.value;
        if (imagePath) {
            // Send image path to main process
            ipcRenderer.send("save-image-path", imagePath);
            updateImages(imagePath);
            // alert("Settings saved successfully!");
        } else {
            alert("Please enter a valid path.");
        }

        const port = document.getElementById("port-input").value;
        console.log("Port:", port);
        if (port && !isNaN(port) && port > 1024 && port < 65535) {
            // Send the port to the main process to start the Express server
            ipcRenderer.send("start-server", port);
            document.getElementById("settings-modal").style.display = "none";
        } else {
            alert("Please enter a valid port (between 1025 and 65535)");
        }

        // Close modal
        settingsModal.style.display = "none";
    });
});

// Recursive function to get all image files
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
const isImage = (file) =>
    imageExtensions.includes(path.extname(file).toLowerCase());

const getImagesRecursively = (folderPath) => {
    const allFiles = glob.sync(`${folderPath}/**/*`, { nodir: true });
    return allFiles.filter(isImage);
};

// window.onload = () => {
//     const imageContainer = document.getElementById("image-container");
//     const modal = document.getElementById("image-modal");
//     const modalImg = document.getElementById("modal-img");
//     const modalClose = document.getElementById("modal-close");

//     // Recursive function to get all image files
//     const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
//     const isImage = (file) =>
//         imageExtensions.includes(path.extname(file).toLowerCase());

//     const getImagesRecursively = (folderPath) => {
//         const allFiles = glob.sync(`${folderPath}/**/*`, { nodir: true });
//         return allFiles.filter(isImage);
//     };

//     const imagePaths = getImagesRecursively(folderPath);

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src; // Get the image path
                img.style.backgroundImage = `url(file://${src})`; // Set the background image
                observer.unobserve(img); // Stop observing once the image is loaded
            }
        });
    },
    { rootMargin: "50px" }
); // Load images slightly before they appear

//     // Add images to the container
//     imagePaths.forEach((imagePath) => {
//         const img = document.createElement("div");
//         img.className = "image-square";
//         img.title = path.basename(imagePath);
//         img.dataset.src = imagePath; // Store the image path for lazy loading
//         imageContainer.appendChild(img);

//         // Observe the image for lazy loading
//         observer.observe(img);

//         // Add click listener for full view
//         img.addEventListener("click", () => {
//             modal.style.display = "flex";
//             modalImg.src = `file://${imagePath}`;
//         });
//     });

//     // Modal close functionality
//     modalClose.addEventListener("click", () => {
//         modal.style.display = "none";
//         modalImg.src = "";
//     });

function updateImages(newFolder) {
    const imageContainer = document.getElementById("image-container");
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const modalClose = document.getElementById("modal-close");

    const imagePaths = getImagesRecursively(newFolder);

    // Clear the image container
    imageContainer.innerHTML = "";
    console.log("Updating images from", newFolder);
    console.log("Found", imagePaths.length, "images");

    // Add images to the container
    imagePaths.forEach((imagePath) => {
        const img = document.createElement("div");
        img.className = "image-square";
        img.title = path.basename(imagePath);
        img.dataset.src = imagePath; // Store the image path for lazy loading
        imageContainer.appendChild(img);

        // Observe the image for lazy loading
        observer.observe(img);

        // Add click listener for full view
        img.addEventListener("click", () => {
            modal.style.display = "flex";
            modalImg.src = `file://${imagePath}`;
        });
    });

    modalClose.addEventListener("click", () => {
        modal.style.display = "none";
        modalImg.src = "";
    });
}
