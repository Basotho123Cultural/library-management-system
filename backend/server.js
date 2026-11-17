const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
port: process.env.DB_PORT
});

db.connect((err) => {
if (err) {
console.error('Database connection failed:', err.message);
} else {
console.log('MySQL database connected successfully!');
}
});

// Home route
app.get('/', (req, res) => {
res.send('Library Management System API is running!');
});

// GET: Display all books
app.get('/api/books', (req, res) => {
db.query('SELECT * FROM books ORDER BY id DESC', (err, results) => {
if (err) {
return res.status(500).json({ message: err.message });
}

res.json(results);
});
});

// POST: Add a new book
app.post('/api/books', (req, res) => {
const { title, author, genre, isbn, quantity } = req.body;

if (!title || !author || quantity === undefined ||
!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
return res.status(400).json({
message: 'Enter a title, author and valid quantity.'
});
}

const sql = 'INSERT INTO books (title, author, genre, isbn, quantity) VALUES (?, ?, ?, ?, ?)';

db.query(
sql,
[title, author, genre || null, isbn || null, Number(quantity)],
(err, result) => {
if (err) {
return res.status(500).json({ message: err.message });
}

res.status(201).json({
message: 'Book added successfully!',
bookId: result.insertId
});
}
);
});

// PUT: Update a book
app.put('/api/books/:id', (req, res) => {
const { title, author, genre, isbn, quantity } = req.body;

if (!title || !author || quantity === undefined ||
!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
return res.status(400).json({
message: 'Enter valid book details.'
});
}

const sql =` UPDATE books SET title = ?, author = ?, genre = ?, isbn = ?, quantity = ? WHERE id = ?`;

db.query(
sql,
[title, author, genre || null, isbn || null,
Number(quantity), req.params.id],
(err, result) => {
if (err) {
return res.status(500).json({ message: err.message });
}

if (result.affectedRows === 0) {
return res.status(404).json({ message: 'Book not found.' });
}

res.json({ message: 'Book updated successfully!' });
}
);
});

// DELETE: Delete a book
app.delete('/api/books/:id', (req, res) => {
db.query(
'DELETE FROM books WHERE id = ?',
[req.params.id],
(err, result) => {
if (err) {
return res.status(500).json({ message: err.message });
}

if (result.affectedRows === 0) {
return res.status(404).json({ message: 'Book not found.' });
}

res.json({ message: 'Book deleted successfully!' });
}
);
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});