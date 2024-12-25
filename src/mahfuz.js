#!/usr/bin/env node

// Import starts here
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import https from "follow-redirects";
import os from "os";
// Import ends here

// Metadata starts here
//Developer Info Object
const developerInfo = {
  Name: "Mohammad Mahfuz Rahman",
  Profession: "Software Engineer",
  Email: "mahfuzrahman0712@gmail.com",
  Contact: "+8801876891680",
  Github: "https://github.com/mahfuz0712",
  Linkedin: "https://www.linkedin.com/in/mahfuz0712/",
  Facebook: "https://fb.com/mahfuzrahman0712",
  Address: "Mirpur Section - 14, Dhaka 1206 , Bangladesh",
};
// App info Object
const appInfo = {
  AppName: "Mahfuz Js",
  Version: "1.1.4",
  Description: "A CLI tool to create MERN Stack Web Apps.",
  Website: "https://github.com/mahfuz0712/Mahfuz",
  LatestVersion: "https://github.com/mahfuz0712/Mahfuz/releases",
};
// Metadata ends here
// GitHub Token for authentication (optional, but recommended to avoid rate limits)
const githubToken =
  process.env.GITHUB_TOKEN || "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";
// Function to compare version strings
function isNewerVersion(latest, current) {
  const latestParts = latest.split(".").map(Number);
  const currentParts = current.split(".").map(Number);
  for (let i = 0; i < latestParts.length; i++) {
    if (latestParts[i] > (currentParts[i] || 0)) return true;
    if (latestParts[i] < (currentParts[i] || 0)) return false;
  }
  return false;
}
// Function to check for updates
function checkForUpdates(callback) {
  const apiUrl =
    "https://api.github.com/repos/mahfuz0712/mahfuz/releases/latest";
  const options = {
    headers: {
      "User-Agent": "node.js",
      Authorization: `token ${githubToken}`,
    },
  };
  https
    .get(apiUrl, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const release = JSON.parse(data);
          const latestVersion = release.tag_name.replace("v", "");
          if (isNewerVersion(latestVersion, appInfo.Version)) {
            console.log(
              "\x1b[33m%s\x1b[0m",
              `New update for mahfuz js is available! Current version: mahfuz js ${appInfo.Version}, Latest version: mahfuz js ${latestVersion}\nTo Update download  the latest version from ${appInfo.LatestVersion}.\n`
            );
          }
        } catch (error) {
          console.error("Error parsing release information:", error.message);
        }
        callback();
      });
    })
    .on("error", (err) => {
      console.error("Error checking for updates:", err.message);
      callback();
    });
}
// Define the path where the mpm.exe update file should be saved
const downloadDirectory = path.join("C:", "Program Files (x86)", "Mahfuz JS");
const downloadPath = path.join(downloadDirectory, "mpm.exe");

function downloadMpm(url, dest, callback) {
  const file = fs.createWriteStream(dest);
  https
    .get(
      url,
      {
        headers: {
          "User-Agent": "node.js",
          Authorization: `token ${githubToken}`,
        },
      },
      (response) => {
        if (response.statusCode !== 200) {
          console.error(`Failed to get '${url}' (${response.statusCode})`);
          return callback(
            new Error(`Failed to get '${url}' (${response.statusCode})`)
          );
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close(callback); // Close the file and execute callback
          console.log(`Download Complete`);
        });
      }
    )
    .on("error", (err) => {
      fs.unlink(dest, () => {}); // Delete the file async on error
      console.error("Error downloading the update:", err.message);
      callback(err);
    });
}

function fetchLatestRelease() {
  const apiUrl = "https://api.github.com/repos/mahfuz0712/mpm/releases/latest";
  const options = {
    headers: {
      "User-Agent": "node.js",
      Authorization: `token ${githubToken}`,
    },
  };
  https
    .get(apiUrl, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const release = JSON.parse(data);
          const asset = release.assets.find((asset) =>
            asset.name.endsWith(".exe")
          );
          if (asset) {
            console.log("Downloading latest version of mpm:");
            // Ensure the download directory exists
            fs.mkdirSync(downloadDirectory, { recursive: true });
            downloadMpm(asset.browser_download_url, downloadPath, (err) => {
              if (err) {
                console.error("Download failed:", err.message);
              } else {
                console.log("Mahfuz Package Manager Updated!");
              }
            });
          } else {
            console.error("No update found in the latest release.");
          }
        } catch (error) {
          console.error("Error parsing release data:", error.message);
        }
      });
    })
    .on("error", (err) => {
      console.error("Error fetching release information:", err.message);
    });
}
function downloadIcon(url, dest) {
  const file = fs.createWriteStream(dest);
  https
    .get(url, (response) => {
      // Check if the request was successful
      if (response.statusCode !== 200) {
        console.error(
          `Failed to download icon, status code: ${response.statusCode}`
        );
        return;
      }
      // Pipe the response into the file
      response.pipe(file);
      // Close the file stream on completion
      file.on("finish", () => {
        file.close();
      });
    })
    .on("error", (err) => {
      fs.unlink(dest, () => {}); // Delete the file if an error occurs
      console.error("Error downloading the icon:", err.message);
    });
}

// Run the update check before processing commands
checkForUpdates(() => {
  // Get the arguments
  const args = process.argv.slice(2);
  const command = args[0];
  const projectName = args[1]; // 'myapp' in 'mahfuz.exe create-mern-app myapp'
  // Check if the command is correct
  if (!command || !projectName) {
    console.error(
      "Usage: mahfuz create-mern-app-vite-react <project-name> or mahfuz create-mern-app-cra-react <project-name> or mahfuz show version or mahfuz show developer_info"
    );
    process.exit(1);
  }

  if (command == "show" && projectName == "version") {
    console.log(appInfo);
    process.exit(1);
  } else if (command == "show" && projectName == "developer_info") {
    console.log(developerInfo);
    process.exit(1);
  } else if (command == "upgrade" && projectName == "mpm") {
    fetchLatestRelease();
  } else if (command == "create-mern-app" && projectName) {
    // Create project directory
    const projectPath = path.join(process.cwd(), projectName);
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
    }
    //Backend Setting Starts From Here
    // Step 1: Create the backend folder
    const backendPath = path.join(projectPath, "backend");
    if (!fs.existsSync(backendPath)) fs.mkdirSync(backendPath);
    // Step 2: Run `npm init -y` and install dependencies in the backend
    console.log("Setting up backend...");
    execSync("npm init -y", { cwd: backendPath, stdio: "inherit" });
    execSync(
      "npm install express mongoose bcrypt cors dotenv mahfuz_mailer body-parser multer cache ejs jsonwebtoken ",
      { cwd: backendPath, stdio: "inherit" }
    );
    // Step 3: Create .env file in the backend
    const envFilePath = path.join(backendPath, ".env");
    fs.writeFileSync(
      envFilePath,
      "PORT=5000\nDB_URI=mongodb://localhost:27017/mydb\n"
    );
    // Step 4: Create controllers, models, routes. library, database folders in backend
    const controllersPath = path.join(backendPath, "controllers");
    const modelsPath = path.join(backendPath, "models");
    const routesPath = path.join(backendPath, "routes");
    const libraryPath = path.join(backendPath, "library");
    const databasePath = path.join(backendPath, "database");
    if (!fs.existsSync(controllersPath)) fs.mkdirSync(controllersPath);
    if (!fs.existsSync(modelsPath)) fs.mkdirSync(modelsPath);
    if (!fs.existsSync(routesPath)) fs.mkdirSync(routesPath);
    if (!fs.existsSync(libraryPath)) fs.mkdirSync(libraryPath);
    if (!fs.existsSync(databasePath)) fs.mkdirSync(databasePath);
    // Step 5:  create databaseConfig.js and index.js in  backend/database and backend
    const databaseConfigFilePath = path.join(databasePath, "databaseConfig.js");
    fs.writeFileSync(
      databaseConfigFilePath,
      "const mongoose = require('mongoose');"
    );
    const indexFilePath = path.join(backendPath, "index.js");
    fs.writeFileSync(indexFilePath, "const express = require('express');");
    // Add Developer Credits
    const developerCreditFilePath = path.join(backendPath, "credits.txt");
    fs.writeFileSync(
      developerCreditFilePath,
      "This tool was developed by Mohammad Mahfuz Rahman\nIf you like this tool then please give a star on his github profile\nGithub: https://github.com/mahfuz0712"
    );
    // Backend Setting Ends Here
    // Frontend Setting Starts  From Here
    //step 6: create the frontend folder
    const frontendPath = path.join(projectPath, "frontend");
    if (!fs.existsSync(frontendPath)) fs.mkdirSync(frontendPath);
    // Step 7: setup vite + react in frontend
    console.log("Setting up frontend...");
    execSync("npm create vite@latest -- --template react .", {
      cwd: frontendPath,
      stdio: "inherit",
    });
    execSync("npm install", { cwd: frontendPath, stdio: "inherit" });
    execSync("npm install axios", { cwd: frontendPath, stdio: "inherit" });
    // Step 8: Create .env file in the frontend
    const frontendEnvFilePath = path.join(frontendPath, ".env");
    fs.writeFileSync(
      frontendEnvFilePath,
      "VITE_API_URL=http://localhost:5000\n"
    );
    // Step 9: Create components folder in frontend/src
    const srcPath = path.join(frontendPath, "src");
    const componentsPath = path.join(srcPath, "components");
    if (!fs.existsSync(componentsPath)) fs.mkdirSync(componentsPath);
    // Replace the code with my code
    const AppFilePath = path.join(srcPath, "App.jsx");
    const newCode = `
  import { useState } from 'react'
  import reactLogo from './assets/react.svg'
  import viteLogo from '/vite.svg'
  import './App.css'
  function App() {
    const [count, setCount] = useState(0)
    return (
      <>
        <div>
          <a href='https://vitejs.dev' target='_blank'>
            <img src={viteLogo} className="logo" alt='Vite logo' />
          </a>
          <a href='https://react.dev' target='_blank'>
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React Js + Mahfuz Js</h1>
        <div className='card'>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className='read-the-docs'>
          Click on the Vite and React logos to learn more
        </p>
      </>
    )
  }
  export default App
  `;
    // Function to replace the content of App.jsx
    function replaceFileContent(Path, Code) {
      try {
        // Write the new content to App.jsx (this will overwrite the existing file)
        fs.writeFileSync(Path, Code, "utf-8");
      } catch (err) {
        console.error(err);
      }
    }
    // Call the function to replace the content
    replaceFileContent(AppFilePath, newCode);
    const IndexHtmlPath = path.join(frontendPath, "index.html");
    const newIndexHtmlCode = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React + Mahfuz js</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.jsx"></script>
      </body>
    </html>
    `;
    replaceFileContent(IndexHtmlPath, newIndexHtmlCode);
    // Add Developer Credits
    const developerCreditFilePathFrontend = path.join(
      frontendPath,
      "credits.txt"
    );
    fs.writeFileSync(
      developerCreditFilePathFrontend,
      "This tool was developed by Mohammad Mahfuz Rahman\nIf you like this tool then please give a star on his github profile\nGithub: https://github.com/mahfuz0712"
    );
    // Frontend Setting Ends Here
    console.log("MERN app setup complete!");
    // Step 10: Ask the user if they want to open the project in VS Code
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(
      "Do you want to open your project in VS Code? (yes/no): ",
      (answer) => {
        if (answer.toLowerCase() === "yes" || "y") {
          // Open the project in VS Code
          execSync("code .", { cwd: projectPath, stdio: "inherit" });
        }
        rl.close();
      }
    );
  } else if (command == "create-mern-app-cra-react" && projectName) {
    // Create a new MERN app with CRA and React
    // Create project directory
    const projectPath = path.join(process.cwd(), projectName);
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
    }
    //Backend Setting Starts From Here
    // Step 1: Create the backend folder
    const backendPath = path.join(projectPath, "backend");
    if (!fs.existsSync(backendPath)) fs.mkdirSync(backendPath);
    // Step 2: Run `npm init -y` and install dependencies in the backend
    console.log("Setting up backend...");
    execSync("npm init -y", { cwd: backendPath, stdio: "inherit" });
    execSync(
      "npm install express mongoose bcrypt cors dotenv mahfuz_mailer body-parser multer cache ejs jsonwebtoken axios",
      { cwd: backendPath, stdio: "inherit" }
    );
    // Step 3: Create .env file in the backend
    const envFilePath = path.join(backendPath, ".env");
    fs.writeFileSync(
      envFilePath,
      "PORT=5000\nDB_URI=mongodb://localhost:27017/mydb\n"
    );
    // Step 4: Create controllers, models, routes. library, database folders in backend
    const controllersPath = path.join(backendPath, "controllers");
    const modelsPath = path.join(backendPath, "models");
    const routesPath = path.join(backendPath, "routes");
    const libraryPath = path.join(backendPath, "library");
    const databasePath = path.join(backendPath, "database");
    if (!fs.existsSync(controllersPath)) fs.mkdirSync(controllersPath);
    if (!fs.existsSync(modelsPath)) fs.mkdirSync(modelsPath);
    if (!fs.existsSync(routesPath)) fs.mkdirSync(routesPath);
    if (!fs.existsSync(libraryPath)) fs.mkdirSync(libraryPath);
    if (!fs.existsSync(databasePath)) fs.mkdirSync(databasePath);
    // Step 5:  create databaseConfig.js and index.js in  backend/database and backend
    const databaseConfigFilePath = path.join(databasePath, "databaseConfig.js");
    fs.writeFileSync(
      databaseConfigFilePath,
      "const mongoose = require('mongoose');"
    );
    const indexFilePath = path.join(backendPath, "index.js");
    fs.writeFileSync(indexFilePath, "const express = require('express');");
    // Add Developer Credits
    const developerCreditFilePath = path.join(backendPath, "credits.txt");
    fs.writeFileSync(
      developerCreditFilePath,
      "This tool was developed by Mohammad Mahfuz Rahman\nIf you like this tool then please give a star on his github profile\nGithub: https://github.com/mahfuz0712"
    );
    // Backend Setting Ends Here
    // Frontend Setting Starts  From Here
    //step 6: create the frontend folder
    const frontendPath = path.join(projectPath, "frontend");
    if (!fs.existsSync(frontendPath)) fs.mkdirSync(frontendPath);
    // Step 7: setup cra + react + mahfuz js in frontend
    console.log("Setting up frontend...");
    execSync("npx create-react-app .", {
      cwd: frontendPath,
      stdio: "inherit",
    });
    execSync("npm install axios", { cwd: frontendPath, stdio: "inherit" });
    // Step 8: Create .env file in the frontend
    const frontendEnvFilePath = path.join(frontendPath, ".env");
    fs.writeFileSync(
      frontendEnvFilePath,
      "cra_API_URL=http://localhost:5000\n"
    );
    // Step 9: Create components folder in frontend/src
    const srcPath = path.join(frontendPath, "src");
    const componentsPath = path.join(srcPath, "components");
    if (!fs.existsSync(componentsPath)) fs.mkdirSync(componentsPath);
    // Replace the code with my code
    const AppFilePath = path.join(srcPath, "App.js");
    const newCode = `
    import logo from './logo.svg';
    import './App.css';
    function App() {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and please enable auto save in your ide to see changes.
            </p>
            <a
              className="App-link"
              href="https://github.com/mahfuz0712/Mahfuz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Mahfuz Js
            </a>
            <h1>React Js + Mahfuz Js</h1>
          </header>
        </div>
      );
    }
    export default App;
  `;
    // Function to replace the content of App.jsx
    function replaceFileContent(Path, Code) {
      try {
        // Write the new content to App.jsx (this will overwrite the existing file)
        fs.writeFileSync(Path, Code, "utf-8");
      } catch (err) {
        console.error(err);
      }
    }
    // Call the function to replace the content
    replaceFileContent(AppFilePath, newCode);
    const publicPath = path.join(frontendPath, "public");
    const IndexHtmlPath = path.join(publicPath, "index.html");
    const newIndexHtmlCode = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>React + Mahfuz Js</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
    `;
    replaceFileContent(IndexHtmlPath, newIndexHtmlCode);
    // Add Developer Credits
    const developerCreditFilePathFrontend = path.join(
      frontendPath,
      "credits.txt"
    );
    fs.writeFileSync(
      developerCreditFilePathFrontend,
      "This tool was developed by Mohammad Mahfuz Rahman\nIf you like this tool then please give a star on his github profile\nGithub: https://github.com/mahfuz0712"
    );
    // Frontend Setting Ends Here
    console.log("MERN app setup complete!");
    // Step 10: Ask the user if they want to open the project in VS Code
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(
      "Do you want to open your project in VS Code? (yes/no): ",
      (answer) => {
        if (answer.toLowerCase() === "yes" || "y") {
          // Open the project in VS Code
          execSync("code .", { cwd: projectPath, stdio: "inherit" });
        }
        rl.close();
      }
    );
  } else if (command == "create-python-app" && projectName) {
    // Create project directory
    const projectPath = path.join(process.cwd(), projectName);
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
    }
    console.log("Initializing" + " " + projectName + "" + "...");
    const username = os.userInfo().username;
    //   create project json file
    const projectJsonPath = path.join(projectPath, "project.json");
    fs.writeFileSync(
      projectJsonPath,
      `
  {
    "name": "${projectName}",
    "version": "1.0.0",
    "description": "Python GUI App Boilerplate Code Designed By Mohammad Mahfuz Rahman",
    "scripts": {
      "start": "mahfuz_modules\\\\Scripts\\\\activate",
      "install-modules": "py -m pip install -r requirements.txt",
      "update-modules": "pip install --upgrade -r requirements.txt",
      "dev": "py app.py",
      "build": "pyinstaller --noconsole --onefile --name ${projectName} app.py",
      "build-with-icon": "pyinstaller --noconsole --onefile --icon=icon.ico --name ${projectName} app.py",
      "end": "deactivate"
    },
    "keywords": [
      "Python App GUI",
      "Python Engineering",
      "Software Enginnering"
    ],
    "author": "${username}",
    "license": "ISC"
  }
      `
    );
    const appFile = path.join(projectPath, "app.py");
    fs.writeFileSync(
      appFile,
      `
import customtkinter as ctk
from pytbangla import computer

# Create the main application class
class App(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Set the window title
        self.title("Python Gui App")

        # Set the window size
        self.geometry("500x400")

        # Center the window on the screen
        self.center_window()

        # Create a frame to hold the label and button
        self.frame = ctk.CTkFrame(self)
        self.frame.pack(expand=True)  # Expand the frame to fill the window

        # Create a label without text_font argument
        self.label = ctk.CTkLabel(self.frame, text="Mahfuz Rahman's  Python Gui App Boilerplate")

        self.label.pack(pady=20)  # Add some vertical padding

        # Create a button to tell the user how to use this 
        self.speak_button = ctk.CTkButton(self.frame, text="How to customise", command=self.speak)
        self.speak_button.pack(pady=15)

        # Create a button to close the application
        self.close_button = ctk.CTkButton(self.frame, text="Close", command=self.close_app)
        self.close_button.pack(pady=10)  # Add some vertical padding
    def speak(self):
        computer.bolo("Hello, I am a python gui app designed by Mohammad Mahfuz Rahman. You can customise me according to your idea or needs and most important set an icon for me by saving a icon.icon file in this project directory")
    def center_window(self):
        # Get the dimensions of the screen
        screen_width = self.winfo_screenwidth()
        screen_height = self.winfo_screenheight()

        # Get the dimensions of the window
        window_width = 500  # Set your desired width
        window_height = 400  # Set your desired height

        # Calculate x and y coordinates to center the window
        x = (screen_width // 2) - (window_width // 2)
        y = (screen_height // 2) - (window_height // 2)

        # Set the position of the window
        self.geometry(f"{window_width}x{window_height}+{x}+{y}")

    def close_app(self):
        self.destroy()  # Close the application

# Run the application
if __name__ == "__main__":
    app = App()
    app.mainloop()
    `
    );
    // Create a virtual python dependency environment
    execSync("python -m venv mahfuz_modules", {
      cwd: projectPath,
      stdio: "inherit",
    });
    // activate the virtual environment
    execSync("mahfuz_modules\\Scripts\\activate", {
      cwd: projectPath,
      stdio: "inherit",
    });
    // install the modules  required by the project by running the following command in the terminal:
    execSync("pip install pytbangla pyinstaller matplotlib customtkinter", {
      cwd: projectPath,
      stdio: "inherit",
    });
    // Create a requirement file for the packages to update later
    execSync("pip freeze > requirements.txt", {
      cwd: projectPath,
      stdio: "inherit",
    });

    // Example usage
    const url =
      "https://icon-icons.com/downloadimage.php?id=188903&root=3027/ICO/512/&file=python_icon_188903.ico";
    const iconPath = path.join(projectPath, "icon.ico");
    downloadIcon(url, iconPath);

    // Add Developer Credits
    const developerCreditFilePath = path.join(projectPath, "credits.txt");
    fs.writeFileSync(
      developerCreditFilePath,
      "This tool was developed by Mohammad Mahfuz Rahman\nIf you like this tool then please give a star on his github profile\nGithub: https://github.com/mahfuz0712"
    );

    console.log("python app setup complete!");

    // Step 10: Ask the user if they want to open the project in VS Code
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "Do you want to open your project in VS Code? (yes/no): ",
      (answer) => {
        if (answer.toLowerCase() === "yes" || "y") {
          // Open the project in VS Code
          execSync("code .", { cwd: projectPath, stdio: "inherit" });
        }
        rl.close();
      }
    );
  } else if (command === "create-chrome-extension" && projectName) {
    // Create project directory
    const projectPath = path.join(process.cwd(), projectName);
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
    }
    console.log("Initializing" + " " + projectName + "" + "...");
    //   create manifest json file
    const manifestJsonPath = path.join(projectPath, "manifest.json");
    fs.writeFileSync(
      manifestJsonPath,
      `
{
    "manifest_version": 3,
    "name": "${projectName}",
    "version": "1.0",
    "description": "A simple Chrome extension Boilerplate code Designed By Mohammad Mahfuz Rahman.\nHire him at https://www.linkedin.com/in/mahfuz0712/",
    "action": {
        "default_popup": "/popup/popup.html",
        "default_icon": "/assets/icon.png",
        "options_page": "/options/options.html"
    },
    "background": {
        "service_worker": "/background/background.js"
    },
    "permissions": [
        "storage",
        "activeTab",
        "scripting"
    ],
    "content_scripts": [
        {
            "matches": [
                "<all_urls>"
            ],
            "js": [
                "/content/content.js"
            ]
        }
    ],
    "icons": {
        "16": "/assets/icon.png",
        "48": "/assets/icon.png",
        "128": "/assets/icon.png"
    }
}
          `
    );
    const assetsFolderPath = path.join(projectPath, "assets");
    if (!fs.existsSync(assetsFolderPath)) {
      fs.mkdirSync(assetsFolderPath);
    }
    // Example usage
    const url =
      "https://raw.githubusercontent.com/mahfuz0712/Mahfuz/refs/heads/main/public/logo.png";
    const iconPath = path.join(assetsFolderPath, "icon.png");
    downloadIcon(url, iconPath);

    const backgroundFolderPath = path.join(projectPath, "background");
    if (!fs.existsSync(backgroundFolderPath)) {
      fs.mkdirSync(backgroundFolderPath);
    }
    const backgroundJsFile = path.join(backgroundFolderPath, "background.js");
    fs.writeFileSync(
      backgroundJsFile,
      `
chrome.runtime.onInstalled.addListener(() => {
  alert("Extension installed and ready!");
});
      `
    );

    const contentFolderPath = path.join(projectPath, "content");
    if (!fs.existsSync(contentFolderPath)) {
      fs.mkdirSync(contentFolderPath);
    }
    const contentJsFile = path.join(contentFolderPath, "content.js");
    fs.writeFileSync(
      contentJsFile,
      `
      console.log("edit the content.js file");
      `
    );
    const optionsFolderPath = path.join(projectPath, "options");
    if (!fs.existsSync(optionsFolderPath)) {
      fs.mkdirSync(optionsFolderPath);
    }
    const optionJsFile = path.join(optionsFolderPath, "options.js");
    fs.writeFileSync(
      optionJsFile,
      `
document.getElementById("setting1").addEventListener("change", (event) => {
  chrome.storage.sync.set({ setting1: event.target.checked });
});
  
      `
    );
    const optionHtmlFile = path.join(optionsFolderPath, "options.html");
    fs.writeFileSync(
      optionHtmlFile,
      `
<!DOCTYPE html>
<html>
<head>
  <title>Extension Options</title>
  <script src="options.js"></script>
</head>
<body>
  <h1>Settings</h1>
  <label>
    <input type="checkbox" id="setting1">
    Enable feature
  </label>
</body>
</html>

      `
    );
    const popupFolderPath = path.join(projectPath, "popup");
    if (!fs.existsSync(popupFolderPath)) {
      fs.mkdirSync(popupFolderPath);
    }
    const popupJsFile = path.join(popupFolderPath, "popup.js");
    fs.writeFileSync(
      popupJsFile,
      `
document.getElementById("myButton").addEventListener("click", () => {
  alert("edit the /popup/popup.html for changes. Happy Coding !");
  document.body.style.backgroundColor = "lightblue";
});

      `
    );
    const popupHtmlFile = path.join(popupFolderPath, "popup.html");
    fs.writeFileSync(
      popupHtmlFile,
      `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Extension</title>
    <link rel="stylesheet" href="popup.css" />
  </head>
  <body>
    <div class="popup-container">
      <header class="header">
        <h1>Mahfuz Js</h1>
        <p>Build Chrome Extensions With Mahfuz Js</p>
      </header>
      <main class="content">
        <button id="myButton" class="action-button">Click Me</button>
      </main>
      <footer class="footer">
        <p>&copy; 2024 My Extension</p>
      </footer>
    </div>
    <script src="popup.js"></script>
  </body>
</html>

      `
    );
    const popupCssFile = path.join(popupFolderPath, "popup.css");
    fs.writeFileSync(
      popupCssFile,
      `
/* popup.css */

/* Reset and base styling */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 300px;
  min-height: 200px;
}

.popup-container {
  text-align: center;
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
}

/* Header styling */
.header h1 {
  font-size: 1.5rem;
  color: #333;
}

.header p {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 20px;
}

/* Button styling */
.action-button {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: #45a049;
}

/* Footer styling */
.footer {
  margin-top: 20px;
  font-size: 0.8rem;
  color: #999;
}
      `
    );
    // Add Developer Credits
    const developerCreditFilePath = path.join(projectPath, "credits.txt");
    fs.writeFileSync(
      developerCreditFilePath,
      "This tool was developed by Mohammad Mahfuz Rahman\nIf you like this tool then please give a star on his github profile\nGithub: https://github.com/mahfuz0712"
    );

    console.log("chrome extension setup complete!");

    // Step 10: Ask the user if they want to open the project in VS Code
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "Do you want to open your project in VS Code? (yes/no): ",
      (answer) => {
        if (answer.toLowerCase() === "yes" || "y") {
          // Open the project in VS Code
          execSync("code .", { cwd: projectPath, stdio: "inherit" });
        }
        rl.close();
      }
    );
  } else {
    console.error("Invalid command");
    console.error(
      "Usage: mahfuz create-mern-app-vite-react <project-name> or mahfuz create-mern-app-cra-react <project-name>\nor mahfuz show version or mahfuz show developer_info"
    );
    process.exit(1);
  }
});
