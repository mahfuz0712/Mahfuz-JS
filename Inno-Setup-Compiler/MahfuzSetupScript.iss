[Setup]
AppName=Mahfuz JS
AppVersion=1.1.4
DefaultDirName={pf}\Mahfuz JS
DefaultGroupName=Mahfuz JS
OutputBaseFilename=setup
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin
SetupIconFile=D:\\JavaScript Projects\\Mahfuz JS\\build\\logo.ico

[Files]
Source: "D:\JavaScript Projects\Mahfuz JS\build\mahfuz.exe"; DestDir: "{app}"; Flags: ignoreversion 
Source: "D:\JavaScript Projects\Mahfuz JS\build\mpm.exe"; DestDir: "{app}"; Flags: ignoreversion 

[Run]
; Add the application path to the system's environment variable
Filename: "cmd"; Parameters: "/c setx PATH ""{app};%PATH%"""; Flags: runhidden

[Icons]
Name: "{group}\Mahfuz JS"; Filename: "{app}\Mahfuz JS.exe"
Name: "{group}\Uninstall Mahfuz JS"; Filename: "{uninstallexe}"

[UninstallDelete]
Type: filesandordirs; Name: "{app}"

[UninstallRun]
; Remove the application path from the system's environment variable on uninstall
Filename: "cmd"; Parameters: "/c setx PATH ""%PATH:{app};=%"""; Flags: runhidden
