#!/usr/bin/env node

// Import starts here
const { execSync } = require("child_process") ;
const fs = require("fs") ;
const path = require("path") ;
const readline = require("readline") ;
const https = require("follow-redirects").https ;
const os = require("os") ;
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
  Version: "1.0.0",
  Description: "A CLI tool to create MERN Stack Web Apps.",
  Website: "https://github.com/mahfuz0712/Mahfuz-JS-MERN-Stack-Library-Tool",
  LatestVersion:
    "https://github.com/mahfuz0712/Mahfuz-JS-MERN-Stack-Library-Tool/releases",
};
// Metadata ends here

// GitHub Token for authentication (optional, but recommended to avoid rate limits)
const githubToken = "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";
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
    "https://api.github.com/repos/mahfuz0712/Mahfuz-JS-MERN-Stack-Library-Tool/releases/latest";
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

          if (res.statusCode === 404) {
            console.warn("No releases found for the repository.");
            return callback();
          }

          if (!release.tag_name) {
            throw new Error("Release tag_name is missing in the response.");
          }

          const latestVersion = release.tag_name.replace("v", "");
          if (isNewerVersion(latestVersion, appInfo.Version)) {
            console.log(
              "\x1b[33m%s\x1b[0m",
              `Update Information: New update for Mahfuz JS is available! Current version: Mahfuz JS ${appInfo.Version}, Latest version: Mahfuz JS ${latestVersion}\nTo Update, download the latest version from ${release.html_url}.\n`
            );
          } else {
            console.log("You are using the latest version of Mahfuz JS.");
          }
        } catch (error) {
          console.error("Update Information:", error.message);
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
  if (!command && !projectName) {
    console.error(
      "Usage: mahfuz create-mern-app <project-name> || mahfuz --version || mahfuz --developer-info || mahfuz upgrade mpm"
    );
    process.exit(1);
  }

  if (command == "--version" && !projectName) {
    console.log(appInfo);
    process.exit(1);
  } else if (command == "--developer-info" && !projectName) {
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
    console.log("Setting up backend...");
    // Step 2: make sub directories and files in the backend
    const backendSubDirs = [];
    backendSubDirs.push(path.join(backendPath, "public"));
    backendSubDirs.push(path.join(backendPath, "public", "temp"));
    backendSubDirs.push(path.join(backendPath, "src"));
    backendSubDirs.push(path.join(backendPath, "src", "app"));
    backendSubDirs.push(path.join(backendPath, "src", "backend"));
    backendSubDirs.push(path.join(backendPath, "src", "controllers"));
    backendSubDirs.push(path.join(backendPath, "src", "database"));
    backendSubDirs.push(path.join(backendPath, "src", "middlewares"));
    backendSubDirs.push(path.join(backendPath, "src", "models"));
    backendSubDirs.push(path.join(backendPath, "src", "routes"));
    backendSubDirs.push(path.join(backendPath, "src", "server"));
    // Create the files
    const backendFiles = [];
    backendFiles.push(path.join(backendPath, "public", "temp", ".gitkeep"));
    backendFiles.push(path.join(backendPath, "src", "app", "app.js"));
    backendFiles.push(path.join(backendPath, "src", "backend", "backend.js"));
    backendFiles.push(
      path.join(backendPath, "src", "controllers", "user.Controller.js")
    );
    backendFiles.push(
      path.join(backendPath, "src", "database", "db.Config.js")
    );
    backendFiles.push(
      path.join(backendPath, "src", "routes", "user.Routes.js")
    );
    backendFiles.push(path.join(backendPath, "src", "server", "server.js"));
    backendFiles.push(path.join(backendPath, "package.json"));
    backendFiles.push(path.join(backendPath, ".env"));
    backendFiles.push(path.join(backendPath, ".prettierignore"));
    backendFiles.push(path.join(backendPath, ".prettierrc"));
    backendFiles.push(path.join(backendPath, "README.md"));
    backendFiles.push(path.join(backendPath, "vercel.json"));
    // Create the sub directories
    backendSubDirs.forEach((dir) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    });
    // Create the files
    backendFiles.forEach((file) => {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, "");
      }
    });
    // Add the code to the files
    const appJsContent = `
// import express from "express";
import backend from "../backend/backend.js";
const App = backend;



// Routes Import
import UserRouter from "../routes/user.routes.js"; // Import More Routers Here

// Routes Configuration
App.Use("/api/v1/users", UserRouter);  // Use More Routes Here


export default App;

    `;
    fs.writeFileSync(
      path.join(backendPath, "src", "app", "app.js"),
      appJsContent
    );
    const backendJsContent = 
    `
import dotenv from "dotenv";
dotenv.config();

import { Backend } from "mahfuz-js";

// Create a new Backend instance
const backend = new Backend();
// Connection With Frontend Server
backend.ConnectToFrontend(process.env.FRONTEND_URL);
backend.ConfigureMiddlewares(true);
backend.AddSecurityHeaders(true);

export default backend;


// You Don't Need To Change Anything Here
    `
    ;
    fs.writeFileSync(
      path.join(backendPath, "src", "backend", "backend.js"),
      backendJsContent
    );

    const userControllerJsContent = 
    `
import NodeCache from "node-cache";
// Create a cache instance with a TTL (Time-To-Live) of 120 seconds (2 minutes)
const cache = new NodeCache({ stdTTL: 120 });
import { Utils } from "mahfuz-js";
const Util = new Utils();

// export const RegisterUser = Util.AsyncHandler(async (req, res) => {
//   const { username, email, password } = req.body;
// });

export const RecieveFromFrontend = Util.AsyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ success: false, message: "No message provided" });
  }

  // Store the message in the cache
  cache.set("message", message);

  res.json({ success: true, message: \`Your Message: \${message}\` });
});

export const SendToFrontend = Util.AsyncHandler(async (req, res) => {
  const cachedValue = cache.get("message");

  if (!cachedValue) {
    return res.json({ success: false, message: "No message found in backend" });
  }

  res.json({
    success: true,
    message: \`Received message from Backend: \${cachedValue}\`,
  });
});

    `;
    fs.writeFileSync(
      path.join(backendPath, "src", "controllers", "user.Controller.js"),
      userControllerJsContent
    );

    const dbConfigJsContent = 
    `
import dotenv from "dotenv";
dotenv.config();
const AtlasConfig = {
  subdomain: process.env.DB_SUB_DOMAIN,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  cluster: process.env.DB_CLUSTER,
};

export default AtlasConfig;
    `;
    fs.writeFileSync(
      path.join(backendPath, "src", "database", "db.Config.js"),
      dbConfigJsContent
    );

    const userRoutesJsContent = 
    `
import backend from "../backend/backend.js";
import { RecieveFromFrontend, SendToFrontend} from "../controllers/user.controller.js";


const UserRouter = backend.Router();

UserRouter.route("/sendData").post(RecieveFromFrontend);
UserRouter.route("/recieveData").get(SendToFrontend);


export default UserRouter;

    `;
    fs.writeFileSync(
      path.join(backendPath, "src", "routes", "user.Routes.js"),
      userRoutesJsContent
    );


    const serverJsContent = 
    `
import AtlasConfig from "../database/db.config.js";
import App from "../app/app.js";
import dotenv from "dotenv";
dotenv.config();
// imports Ends Here

// Connect to MongoDB
App.ConnectToDataBase(AtlasConfig)
  .then(() => {
    // Start server
    App.StartServer(process.env.BACKEND_PORT);
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed", err);
  });


// You Don't Need To Change Anything In This File
    `;
    fs.writeFileSync(
      path.join(backendPath, "src", "server", "server.js"),
      serverJsContent
    );

    const envFileContent = 
    `
# Frontend Configuration
FRONTEND_URL=http://localhost:5173
# Backend Configuration
BACKEND_PORT=5000
# Databse Configuration
# MongoDB Atlas 
DB_SUB_DOMAIN=
DB_USERNAME=
DB_PASSWORD=
DB_CLUSTER=
    `
    ;
    fs.writeFileSync(path.join(backendPath, ".env"), envFileContent);

    const prettierignoreContent = 
    `
/.vscode
/node_modules
./dist
*.env
.env
.env.*
    `
    ;
    fs.writeFileSync(path.join(backendPath, ".prettierignore"), prettierignoreContent);

    const prettierrcContent =
    `
{
  "singleQuote": false,
  "bracketSpacing": true,
  "tabWidth": 4,
  "trailingComma": "es5",
  "semi": true
}
    `
    ;
    fs.writeFileSync(path.join(backendPath, ".prettierrc"), prettierrcContent);

    const vercelJsonContent =
    `
    `
    ;
    fs.writeFileSync(path.join(backendPath, "vercel.json"), vercelJsonContent);
    
    const gitignoreContent =
    `
# Backend 
backend/logs
backend/*.log
backend/npm-debug.log*
backend/yarn-debug.log*
backend/yarn-error.log*
backend/pnpm-debug.log*
backend/lerna-debug.log*
backend/node_modules/
backend/dist/
backend/.env
backend/dist-ssr
backend/*.local
# Editor directories and files
backend/.vscode/*
backend/!.vscode/extensions.json
backend/.idea
backend/.DS_Store
backend/*.suo
backend/*.ntvs*
backend/*.njsproj
backend/*.sln
backend/*.sw?



# Frontend
frontend/logs
frontend/*.log
frontend/npm-debug.log*
frontend/yarn-debug.log*
frontend/yarn-error.log*
frontend/pnpm-debug.log*
frontend/lerna-debug.log*
frontend/node_modules/
frontend/dist/
frontend/.env
frontend/dist-ssr
frontend/*.local
# Editor directories and files
frontend/.vscode/*
frontend/!.vscode/extensions.json
frontend/.idea
frontend/.DS_Store
frontend/*.suo
frontend/*.ntvs*
frontend/*.njsproj
frontend/*.sln
frontend/*.sw?

    `
    ;
    fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreContent);

    const readmeContent =
    `
    `
    ;
    fs.writeFileSync(path.join(backendPath, "README.md"), readmeContent);


    const packageJson = 
    `
{
  "name": "backend",
  "version": "1.0.0",
  "description": "backend created using mahfuz-js framework",
  "main": "./src/server/server.js",
  "type": "module",
  "scripts": {
    "start": "node ./src/server/server.js",
    "backend": "nodemon ./src/server/server.js"
  },
  "author": "Mohammad Mahfuz Rahman",
  "license": "MIT",
  "devDependencies": {
    "nodemon": "^3.1.9"
  },
  "dependencies": {}
}
    `;
    fs.writeFileSync(path.join(backendPath, "package.json"), packageJson);

    execSync("npm i && npm install mahfuz-js node-cache dotenv", {
      cwd: backendPath,
      stdio: "inherit",
    });

    // Backend Setting Ends Here

    // Frontend Setting Starts  From Here
       //step 6: create the frontend folder
       const frontendPath = path.join(projectPath, "frontend");
       if (!fs.existsSync(frontendPath)) fs.mkdirSync(frontendPath);
       // Step 7: setup vite + react in frontend
       console.log("Setting up frontend...");

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
  } else {
    console.error("Invalid command");
    console.error(
      "Usage: mahfuz create-mern-app <app-name> || mahfuz --version || mahfuz --developer-info || mahfuz upgrade mpm"
    );
    process.exit(1);
  }
});