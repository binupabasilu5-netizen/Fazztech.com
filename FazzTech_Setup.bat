@echo off
color 0b
title FazzTech Invoice - Installer
echo ========================================================
echo        FAZZTECH PRO INVOICE - INSTALLATION SETUP
echo ========================================================
echo.
echo Installing Software to your computer...

:: Create target directory in Local AppData
set TARGET_DIR=%LOCALAPPDATA%\FazzTech_Invoice
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

:: Copy core app files from current directory
echo Copying Application Files...
copy /Y "index.html" "%TARGET_DIR%\index.html" >nul
copy /Y "style.css" "%TARGET_DIR%\style.css" >nul
copy /Y "script.js" "%TARGET_DIR%\script.js" >nul

echo Configured installation path: %TARGET_DIR%

:: Create Desktop Shortcut using a PowerShell hidden script
echo Creating Desktop Shortcut (Standalone App Mode)...
set PS_SCRIPT="%TEMP%\shortcut.ps1"

echo $WshShell = New-Object -comObject WScript.Shell > %PS_SCRIPT%
echo $Shortcut = $WshShell.CreateShortcut("$HOME\Desktop\FazzTech Invoice.lnk") >> %PS_SCRIPT%
echo $Shortcut.TargetPath = "msedge.exe" >> %PS_SCRIPT%
echo $Shortcut.Arguments = "--app=""file:///%TARGET_DIR:\=/%/index.html""" >> %PS_SCRIPT%
echo $Shortcut.WindowStyle = 1 >> %PS_SCRIPT%
echo $Shortcut.IconLocation = "shell32.dll, 16" >> %PS_SCRIPT%
echo $Shortcut.Description = "FazzTech Pro Invoice Generator" >> %PS_SCRIPT%
echo $Shortcut.WorkingDirectory = "%TARGET_DIR%" >> %PS_SCRIPT%
echo $Shortcut.Save() >> %PS_SCRIPT%

powershell -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File %PS_SCRIPT%
del %PS_SCRIPT%

echo.
echo ========================================================
echo  INSTALLATION SUCCESSFUL!
echo ========================================================
echo You can now open "FazzTech Invoice" from your Desktop.
echo Press any key to exit setup...
pause >nul
exit
