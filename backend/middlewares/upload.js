import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name (workaround for ES module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Store images in a 'assets' folder within the current directory
        cb(null, path.join(__dirname,'../../my-electron-app/images'));  // Path to save the images
    },
    filename: (req, file, cb) => {
        // Set filename to be the original name of the file
        cb(null, Date.now() + path.extname(file.originalname)); // E.g., 1627849567645.jpg
    },
});

// Create upload instance with storage and file validation
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        
        if (extname && mimeType) {
            return cb(null, true);
        } else {
            cb('Error: Images only (jpeg, jpg, png)');
        }
    },
});

export default upload;
