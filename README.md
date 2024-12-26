# PhotoLib

Local photo gallery that can be hosted on a server and connected to from local clients.

- From the server side: a folder is choosen and images are shown recursively in a simple gallery. A port can be chosen which starts an express server to locally serve the images.
- From the client side: the same app is installed but the user can select a local server address to fetch the images from.

PhotoLib is still in development but feel free to collaborate, there are a thousand things to do.

## Prerequisites

To run and develop this app locally, you need the following installed on your computer:

- **Node.js** (LTS version recommended): [Download Node.js](https://nodejs.org/)
- **npm** (comes bundled with Node.js)

## Installation

### 1. Clone the repository

Clone this repository to your local machine:

```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

### 2. Install dependencies

Install all the required dependencies using npm:
```bash
npm install
```

### 3. Run the app

To start the Electron app locally:
```bash
npm start
``` 
This will launch the app, and you can view and browse images based on the folder you configured in the settings.

### 4. Build the app

To package and build the app into a distributable format, run:
```bash
npm run package
```
To create an installer (e.g., .dmg, .exe):

```bash
npm run make
```

This will create the necessary installer for your operating system inside the out/make/ folder.
