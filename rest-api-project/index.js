const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Setup multer for file uploads (file will not be saved to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST endpoint
app.post('/bfhl', upload.single('file_b64'), (req, res) => {
    const { data, user_id, email, roll_number } = req.body;

    // Validate inputs
    if (!user_id || !email || !roll_number || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: "Invalid input format" });
    }

    let numbers = [];
    let alphabets = [];
    let highestLowercaseAlphabet = '';

    // Separate numbers and alphabets
    data.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else if (/^[a-zA-Z]$/.test(item)) {
            alphabets.push(item);
            if (/[a-z]/.test(item)) {
                if (!highestLowercaseAlphabet || item > highestLowercaseAlphabet) {
                    highestLowercaseAlphabet = item;
                }
            }
        }
    });

    // Handle file validation
    const file = req.file;
    let file_valid = false;
    let file_mime_type = '';
    let file_size_kb = 0;

    if (file) {
        file_mime_type = file.mimetype;
        file_size_kb = (file.size / 1024).toFixed(2);
        // Assuming a valid file is a PNG or PDF for example purposes
        if (['image/png', 'application/pdf'].includes(file_mime_type)) {
            file_valid = true;
        }
    }

    // Build the response
    res.json({
        is_success: true,
        user_id,
        email,
        roll_number,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
        file_valid,
        file_mime_type,
        file_size_kb
    });
});

// GET endpoint - returns an operation code
app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});