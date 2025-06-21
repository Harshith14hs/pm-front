@echo off
echo Starting MongoDB...

:: Default MongoDB installation path
set MONGODB_PATH="C:\Program Files\MongoDB\Server\7.0\bin"

:: Create data directory if it doesn't exist
if not exist "C:\data\db" mkdir "C:\data\db"

:: Start MongoDB
"%MONGODB_PATH%\mongod.exe" --dbpath="C:\data\db"

echo MongoDB started successfully!
pause 