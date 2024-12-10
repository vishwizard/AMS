import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { fork } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables for Electron
dotenv.config();

// Define __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create an Electron Window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, 'preload.js'), // Adjusted for __dirname
        },
    });

    win.loadURL('http://localhost:5173');
     // Load frontend (React) page
};

// Function to run the backend Express server (using fork)
const startBackendServer = () => {
    const backendProcess = fork(join(__dirname, 'backend', 'server.js')); // Adjust the path as needed
    backendProcess.on('message', (msg) => {
        console.log(msg);
    });
};

// Electron app ready
app.whenReady().then(async () => {
    await startBackendServer(); // Start the backend Express server
    createWindow(); // Start the frontend window
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
