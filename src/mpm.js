#!/usr/bin/env node
// Imports starts here
const { execSync } = require("child_process");
const fs = require("fs");
const https = require("https");
const path = require("path");
const { exec } = require("child_process");
// Imports ends here

// Metadata starts here
// Developer Info
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

// App Info
const appInfo = {
  AppName: "mpm",
  Version: "1.0.0",
  Description: "Makes  your life easier with software engineering",
  Website: "https://github.com/mahfuz0712/mpm",
  LatestVersionUrl: "https://github.com/mahfuz0712/mpm/releases",
};
// Metadata ends here

// GitHub Token (set your token here)
const githubToken = "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";
const username = "mahfuz0712"; // GitHub username

// function installPackage(repo) {
//   const apiUrl = `https://api.github.com/users/${username}/repos`;

//   const options = {
//     headers: {
//       "User-Agent": "node.js",
//       Authorization: `token ${githubToken}`,
//     },
//   };

//   https
//     .get(apiUrl, options, (res) => {
//       let data = "";
//       res.on("data", (chunk) => (data += chunk));
//       res.on("end", () => {
//         try {
//           const repositories = JSON.parse(data);

//           // Find the specified repository
//           const targetRepo = repositories.find(
//             (r) => r.name.toLowerCase() === repo.toLowerCase()
//           );

//           if (targetRepo) {
//             // Clone the repository
//             console.log(`installing: ${repo}`);
//             const cloneUrl = targetRepo.clone_url;

//             execSync(`git clone ${cloneUrl}`, (error, stdout, stderr) => {
//               if (error) {
//                 // Extract the fatal message from stderr
//                 const fatalMessage = stderr
//                   .split("\n")
//                   .find((line) => line.startsWith("fatal:"));
//                 if (fatalMessage) {
//                   console.error(`Error installing ${repo}:\n${fatalMessage}`);
//                 } else {
//                   console.error(`Error installing ${repo}:\n${error.message}`);
//                 }
//                 return;
//               }
//               if (stdout) {
//                 console.error(`mpm stderr: ${stdout}`);
//                 return;
//               }
//               if (stderr && !stderr.includes("Cloning into")) {
//                 console.error(`mpm stderr: ${stderr}`);
//                 return;
//               }
//               console.log(`${repo} installed successfully: ${stdout}`);
//             });
//           } else {
//             console.error(`${repo} not found on mpm server`);
//           }
//         } catch (error) {
//           console.error("Error parsing pacakges:", error.message);
//         }
//       });
//     })
//     .on("error", (err) => {
//       console.error("Error fetching packages:", err.message);
//     });
// }

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
              `Update Information: New update for mahfuz package manager is available! Current version: mpm ${appInfo.Version}, Latest version: mpm ${latestVersion}\nTo update mpm run : mahfuz upgrade mpm`
            );
          } else {
            console.log(
              "\x1b[32m%s\x1b[0m",
              `You are using the latest version of mpm: ${appInfo.Version}`
            );
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


// Run the update check before processing commands
checkForUpdates(() => {
  // Get command-line arguments
  const args = process.argv.slice(2);
  const command = args[0];
  const commandName = args[1];

  if (!command && !commandName) {
    console.error(
      "Usage:  mpm run <script>  or mpm show <version> or mpm show <developer_info>"
    );
    process.exit(1);
  }

  if (command === "--version" && !commandName) {
    console.log(appInfo);
    process.exit(1);
  } else if (command === "--developer-info" && !commandName) {
    console.log(developerInfo);
    process.exit(1);
  } else if (command === "install" || command === "i" && commandName) {
    // installPackage(commandName);
    execSync(`npm install ${commandName}`, { stdio: "inherit" });

  } else if (command === "i" && !commandName) {
    const projectJsonPath = "./package.json";
    try {
      const data = fs.readFileSync(projectJsonPath, "utf8");
      const packageJson = JSON.parse(data);
      const dependencies = packageJson.dependencies;
      const devDependencies = packageJson.devDependencies;

      if (dependencies) {
        for (const dep in dependencies) {
          // installPackage(dep);
          execSync(`npm install ${dep}`, { stdio: "inherit" });
        }
      } else {
        console.log("No dependencies found in package.json");
      }
      if (devDependencies) {
        for (const devDep in devDependencies) {
          // installPackage(devDep);
          execSync(`npm install ${devDep}`, { stdio: "inherit" });
        }
      } else {
        console.log("No devDependencies found in package.json");
      }
    } catch (error) {
      console.error("Error reading package.json:", error.message);
    }
  } else if (command === "run" && commandName) {
    const projectJsonPath = "./package.json";
    try {
      const data = fs.readFileSync(projectJsonPath, "utf8");
      const packageJson = JSON.parse(data);
      const scripts = packageJson.scripts;

      if (scripts[commandName]) {
        execSync(scripts[commandName], { stdio: "inherit" });
      } else {
        console.log(
          "Invalid script, make sure the script you are trying to run is in your package.json"
        );
      }
    } catch (error) {
      console.error("Error reading package.json:", error.message);
    }
  } else {
    console.error("Invalid command");
    console.error(
      "Usage: mpm run <script> || mpm --version || mpm --developer-info"
    );
    process.exit(1);
  }
});
