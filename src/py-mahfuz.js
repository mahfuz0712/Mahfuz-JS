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


else if (command == "create-python-app" && projectName) {
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
  }