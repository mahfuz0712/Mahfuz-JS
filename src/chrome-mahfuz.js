else if (command === "create-chrome-extension" && projectName) {
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
  }