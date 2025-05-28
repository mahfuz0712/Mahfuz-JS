#!/usr/bin/env node

// Import starts here
const { execSync } = require("child_process") ;
const fs = require("fs") ;
const path = require("path") ;
const readline = require("readline") ;
const https = require("follow-redirects").https ;
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
  Version: "1.0.1",
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
            console.log("\x1b[32m%s\x1b[0m", "You are using the latest version of Mahfuz JS.");
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

function downloadIcon(url, dest, callback) {
  const file = fs.createWriteStream(dest);

  https
    .get(url, (response) => {
      if (response.statusCode !== 200) {
        callback(
          new Error(`Failed to download file: Status code ${response.statusCode}`),
          null
        );
        return;
      }

      // Pipe the response into the file
      response.pipe(file);

      // Ensure the file is fully written before calling the callback
      file.on("finish", () => {
        file.close((err) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, dest);
          }
        });
      });

      // Handle file stream errors
      file.on("error", (err) => {
        callback(err, null);
      });
    })
    .on("error", (err) => {
      callback(err, null);
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
      path.join(backendPath, "src", "routes", "user.Router.js")
    );
    backendFiles.push(path.join(backendPath, "src", "server", "server.js"));
    backendFiles.push(path.join(backendPath, ".env"));
    backendFiles.push(path.join(backendPath, ".prettierignore"));
    backendFiles.push(path.join(backendPath, ".prettierrc"));
    backendFiles.push(path.join(backendPath, "package.json"));
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
import backend from "../backend/backend.js";
const App = backend;



// Routes Import
import UserRouter from "../routes/user.Router.js"; // Import More Routers Here

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
import { RecieveFromFrontend, SendToFrontend} from "../controllers/user.Controller.js";


const UserRouter = backend.Router();

UserRouter.route("/sendData").post(RecieveFromFrontend);
UserRouter.route("/recieveData").get(SendToFrontend);


export default UserRouter;

    `;
    fs.writeFileSync(
      path.join(backendPath, "src", "routes", "user.Router.js"),
      userRoutesJsContent
    );


    const serverJsContent = 
    `
import AtlasConfig from "../database/db.Config.js";
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
# Getting Started With Mahfuz JS MERN Stack Library

## Project Directory Structure
\`\`\`
appName/
├── backend/
│   ├── public/
│   │   └── temp/
│   ├── src/
│   │   ├── app/
│   │   │   └── app.js
│   │   ├── backend/
│   │   │   └── backend.js
│   │   ├── controllers/
│   │   │   └── user.Controller.js
│   │   ├── database/
│   │   │   └── db.Config.js
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   │   └── user.Router.js
│   │   ├── server/
│   │   │   └── server.js
│   ├── .env
│   ├── .prettierignore
│   ├── .prettierrc
│   ├── package.json
│   └── vercel.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── contexts/
│   │   ├── app/
│   │   │   └── store.js
│   │   ├── frontend/
│   │   │   └── frontend.jsx
│   │   ├── layouts/
│   │   │   └── layout.jsx
│   │   ├── pages/
│   │   │   ├── NotFound.jsx
│   │   │   └── Welcome.jsx
│   │   ├── routes/
│   │   │   └── Router.jsx
│   │   ├── server/
│   │   │   └── Index.jsx
│   │   ├── styles/
│   │       └── Tailwind.css
│   ├── .env
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── .gitignore
└── Readme.md
\`\`\`
## Setup

## Start The Backend Server
open a new terminal and type
\`\`\`bash
cd backend
npm run backend
\`\`\`

## Start The Frontend Server
open a new terminal and type
\`\`\`
cd frontend
npm run frontend
\`\`\`
# Credits

## Author
Mohammad Mahfuz Rahman

Email: mahfuzrahman0712@gmail.com 

Github: https://github.com/mahfuz0712

Linkedin: https://www.linkedin.com/in/mahfuz0712/


## License
MIT License

\`\`\`javascript
console.log("Happy Coding! 🚀");
\`\`\
    `
    ;
    fs.writeFileSync(path.join(projectPath, "README.md"), readmeContent);


    const packageJson = 
    `
{
  "name": "backend",
  "version": "1.0.0",
  "description": "backend created using mahfuz-js library",
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
       // Step 7: Setup  frontend
        console.log("Setting up frontend...");
        // Create directories
        const frontendDirs = [];
        frontendDirs.push(path.join(frontendPath,"public"));
        frontendDirs.push(path.join(frontendPath,"src"));
        frontendDirs.push(path.join(frontendPath,"src","assets"));
        frontendDirs.push(path.join(frontendPath,"src","components"));
        frontendDirs.push(path.join(frontendPath,"src","contexts"));
        frontendDirs.push(path.join(frontendPath,"src","app"));
        frontendDirs.push(path.join(frontendPath,"src","frontend"));
        frontendDirs.push(path.join(frontendPath,"src","layouts"));
        frontendDirs.push(path.join(frontendPath,"src","pages"));
        frontendDirs.push(path.join(frontendPath,"src","routes"));
        frontendDirs.push(path.join(frontendPath,"src","server"));
        frontendDirs.push(path.join(frontendPath,"src","styles"));

        // Create the files
        const frontendFiles = [];
        frontendFiles.push(path.join(frontendPath,"src","components","Header.jsx"));
        frontendFiles.push(path.join(frontendPath,"src","components","Footer.jsx"));
        frontendFiles.push(path.join(frontendPath,"src","app","store.js"));
        frontendFiles.push(path.join(frontendPath,"src","frontend","Frontend.jsx"));
        frontendFiles.push(path.join(frontendPath,"src","layouts","Layout.jsx"));
        frontendFiles.push(path.join(frontendPath,"src","pages","Welcome.jsx"));
        frontendFiles.push(path.join(frontendPath,"src","pages","NotFound.jsx"));
        frontendFiles.push(path.join(frontendPath,"src","routes","Router.jsx"));
        frontendFiles.push(path.join(frontendPath,"src","server","Index.jsx"));
        frontendFiles.push(path.join(frontendPath,"src","styles","Tailwind.css"));
        frontendFiles.push(path.join(frontendPath,".env"));
        frontendFiles.push(path.join(frontendPath,"eslint.config.js"));
        frontendFiles.push(path.join(frontendPath,"index.html"));
        frontendFiles.push(path.join(frontendPath,"package.json"));
        frontendFiles.push(path.join(frontendPath,"postcss.config.js"));
        frontendFiles.push(path.join(frontendPath,"tailwind.config.js"));
        frontendFiles.push(path.join(frontendPath,"vercel.json"));
        frontendFiles.push(path.join(frontendPath,"vite.config.js"));


        const url1 = "https://drive.google.com/uc?export=download&id=1autmYXx7UEkVCK59WlJEcFVw6HYKZAz6";
        const destination1 = path.join(frontendPath,"public", "MahfuzJs.png");
        downloadIcon(url1, destination1, (err, filePath) => {
          if (err) {
            console.error("No Internet");
            return;
          } else {
            // wait for five seconds 
            setTimeout(() => {
              // console.log("Downloaded MahfuzJs.png");
            }, 5000);
          }
        });
        const url2 = "https://drive.google.com/uc?export=download&id=1FW5tS8XqQCXa1cDb2MDPJ8MZOlM0gPC0"
        const destination2 = path.join(frontendPath,"public", "mahfuzjs.ico");
        downloadIcon(url2, destination2, (err, filePath) => {
          if (err) {
            console.error("No Internet");
            return;
          }  else {
            // wait for five seconds 
            setTimeout(() => {
              // console.log("Downloaded MahfuzJs.png");
            }, 5000);
          }

        });


        // Write the files
        frontendDirs.forEach((dir) => {
          if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        });
        frontendFiles.forEach((file) => {
          if (!fs.existsSync(file)) {
            fs.writeFileSync(file, "");
            }
        });

        // Add the code to the files
        const headerJsxContent = 
        `
import { FaGithub } from "react-icons/fa";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-transparent text-white shadow-md">
      <div className="flex items-center">
        <img src="mahfuzjs.ico" alt="Mahfuz JS Logo" className="h-10 mr-3" />
        <span className="text-2xl font-bold">Mahfuz JS</span>
      </div>
      <nav className="flex gap-6">
        <a
          href="#docs"
          className="hover:text-blue-500 transition-colors duration-300"
        >
          Docs
        </a>
        <a
          href="#developer"
          className="hover:text-blue-500 transition-colors duration-300"
        >
          Developer
        </a>
        <a
          href="#support"
          className="hover:text-blue-500 transition-colors duration-300"
        >
          Support
        </a>
        <a
          href="https://github.com/mahfuz0712/mahfuz-js-mern-stack-framework"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors duration-300"
        >
          <FaGithub size={24} />
        </a>
      </nav>
    </header>
  );
};

export default Header;

        `
        ;
        const headerJsxPath = path.join(frontendPath, "src", "components", "Header.jsx");
        fs.writeFileSync(headerJsxPath, headerJsxContent);

        const footerJsxContent =
        `
const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full py-4 bg-transparent text-white text-center">
      <p>
        Designed & Developed By{" "}
        <a href="https://www.linkedin.com/in/mahfuz0712/" target="_blank">
          Mohammad Mahfuz Rahman
        </a>
      </p>
    </footer>
  );
};

export default Footer;

        `
        ;
        const footerJsxPath = path.join(frontendPath, "src", "components", "Footer.jsx");
        fs.writeFileSync(footerJsxPath, footerJsxContent);


        const frontendJsxContent =
        `
import { Frontend } from "mahfuz-js-frontend";


const frontend = new Frontend();
frontend.ConnectToBackend(import.meta.env.VITE_BACKEND_URL);

export default frontend;

        `
        ;
        const frontendJsxPath = path.join(frontendPath, "src", "frontend", "Frontend.jsx");
        fs.writeFileSync(frontendJsxPath, frontendJsxContent);


        const layoutJsxContent =
        `
import Header from "../components/Header.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx";

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;

        `
        ;
        const layoutJsxPath = path.join(frontendPath, "src", "layouts", "Layout.jsx");
        fs.writeFileSync(layoutJsxPath, layoutJsxContent);


        const welcomeJsxContent =
        `
import { useState } from "react";
import frontend from "../frontend/Frontend.jsx";
import swal from "sweetalert";
// Imports Ends Here

// App Component Starts Here
const Welcome = () => {
  const [Data1, setData1] = useState("{ Welcome to Mahfuz JS } ");
  const [Data2, setData2] = useState(
    "</ Beginner friendly MERN Stack framework >"
  );

  const SendData = async () => {
    swal({
      title: "Send Data to Backend",
      text: "Please enter your message:",
      content: "input",
      button: {
        text: "Send",
        closeModal: false, // Prevents closing the modal when clicking the button
      },
      closeOnClickOutside: false, // Prevents closing when clicking outside
    }).then(async (userInput) => {
      try {
        const data = { message: userInput };
        const response = await frontend.post("api/v1/users/sendData", data);
        if (response?.data?.success === false) {
          await swal({
            title: "Error sending data",
            text: response.data.message || "Unknown error",
            icon: "error",
          });
        } else {
          await swal({
            title: "Data Sent",
            text: response.data.message,
            icon: "success",
          });
          setData1("See the magic now click on 'Receive Data' button");
        }
      } catch (error) {
        await swal({
          title: "Error sending data",
          text: error.message,
          icon: "error",
        });
      }
    });
  };

  const RecieveData = async () => {
    try {
      const response = await frontend.get("api/v1/users/recieveData");
      if (response?.data?.success === false) {
        await swal({
          title: "Error receiving data",
          text: response.data.message || "Unknown error",
          icon: "error",
        });
      } else {
        await swal({
          title: "Data Received",
          text: response.data.message,
          icon: "success",
        });
        setData2("Did you see the magic? Now you can work on your logic");
      }
    } catch (error) {
      await swal({
        title: "Error receiving data",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
      <div
        className="bg-[#212121] bg-cover bg-center min-h-screen flex flex-col justify-center items-center p-5 text-white text-center"
        style={{backgroundImage: "url('MahfuzJs.png')"}}
      >
        <h1 className="text-5xl font-bold mb-4">{Data1}</h1>
        <p className="text-xl mb-8">{Data2}</p>
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={SendData}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded"
          >
            Send Data to Backend
          </button>
          <button
            onClick={RecieveData}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded"
          >
            Receive Data from Backend
          </button>
        </div>
        <p className="text-xl mt-8 mb-8 max-w-2xl">
          <code>
            Everything is set up. All you need to do is just work on your logic.
            Backend + Frontend is ready to go. Database connection is also
            ready. Necessary packages are installed. No need to worry about the
            body parser, CORS, etc.
          </code>
        </p>
      </div>
   
  );
};

export default Welcome;

        `
        ;
        const welcomeJsxPath = path.join(frontendPath, "src", "pages", "Welcome.jsx");
        fs.writeFileSync(welcomeJsxPath, welcomeJsxContent);


        const notFoundJsxContent =
        `
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="bg-[#212121] min-h-screen flex flex-col justify-center items-center text-white text-center p-5">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">Page Not Found</p>
      <Link to="/welcome" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
        `
        ;
        const notFoundJsxPath = path.join(frontendPath, "src", "pages", "NotFound.jsx");
        fs.writeFileSync(notFoundJsxPath, notFoundJsxContent);


        const routerJsxContent =
        `
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "../layouts/Layout.jsx";
import NotFound from "../pages/NotFound.jsx";
import Welcome from "../pages/Welcome.jsx";
const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Welcome />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default Router;
        `
        ;
        const routerJsxPath = path.join(frontendPath, "src", "routes", "Router.jsx");
        fs.writeFileSync(routerJsxPath, routerJsxContent);


        const indexJsxContent =
        `
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/Tailwind.css";

import { RouterProvider } from "react-router-dom";

import Router from "../routes/Router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={Router}/>
  </StrictMode>
);

        `
        ;
        const indexJsxPath = path.join(frontendPath, "src", "server", "Index.jsx");
        fs.writeFileSync(indexJsxPath, indexJsxContent);


        const tailwindContent =
        `
@tailwind base;
@tailwind components;
@tailwind utilities;
        `
        ;
        const tailwindPath = path.join(frontendPath, "src", "styles", "Tailwind.css");
        fs.writeFileSync(tailwindPath, tailwindContent);


        const envFileContentFrontend =
        `
# Backend Configuration
VITE_BACKEND_URL=http://localhost:5000
        `
        ;
        const envFilePathFrontend = path.join(frontendPath, ".env");
        fs.writeFileSync(envFilePathFrontend, envFileContentFrontend);


        const eslintConfigContent =
        `
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]

        `
        ;
        const eslintConfigPath = path.join(frontendPath, "eslint.config.js");
        fs.writeFileSync(eslintConfigPath, eslintConfigContent);


        const indexHtmlContent =
        `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/mahfuzjs.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mahfuz JS Library</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/server/Index.jsx"></script>
  </body>
</html>

        `
        ;
        const indexHtmlPath = path.join(frontendPath, "index.html");
        fs.writeFileSync(indexHtmlPath, indexHtmlContent);


        const packageJsonFrontendContent =
        `
{
  "name": "frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "frontend": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
  },
  "devDependencies": {
    "@eslint/js": "^9.15.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.15.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.14",
    "globals": "^15.12.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^6.0.1"
  }
}

        `
        ;
        const packageJsonFrontendPath = path.join(frontendPath, "package.json");
        fs.writeFileSync(packageJsonFrontendPath, packageJsonFrontendContent);

       
        const postcssConfigContent =
        `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

        `
        ;
        const postcssConfigPath = path.join(frontendPath, "postcss.config.js");
        fs.writeFileSync(postcssConfigPath, postcssConfigContent);


        const tailwindConfigContent =
        `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [],
}


        `
        ;
        const tailwindConfigPath = path.join(frontendPath, "tailwind.config.js");
        fs.writeFileSync(tailwindConfigPath, tailwindConfigContent);


        const vercelJsonContentFrontend =
        `
        `
        ;
        const vercelJsonPathFrontend = path.join(frontendPath, "vercel.json");
        fs.writeFileSync(vercelJsonPathFrontend, vercelJsonContentFrontend);


        const viteConfigContent =
        `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Set the base path
  server: {
    open: '/', // Opens the custom path on \`npm run frontend\`
  },
})

        `
        ;
        const viteConfigPath = path.join(frontendPath, "vite.config.js");
        fs.writeFileSync(viteConfigPath, viteConfigContent);

        execSync("npm i && npm install mahfuz-js-frontend prop-types react react-dom react-router-dom react-icons sweetalert", { cwd: frontendPath, stdio: "inherit" });

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