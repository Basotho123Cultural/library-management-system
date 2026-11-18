import { useState, useEffect, useCallback } from 'react'
import BookCard from '../components/BookCard'

const API_URL = 'http://localhost:5000/api/books'

function Books() {
const [books, setBooks] = useState([])

const [title, setTitle] = useState('')
const [author, setAuthor] = useState('')
const [genre, setGenre] = useState('')
const [isbn, setIsbn] = useState('')
const [quantity, setQuantity] = useState('')
const [editingId, setEditingId] = useState(null)

// Load books from MySQL through Express
const loadBooks = useCallback(async () => {
try {
const response = await fetch(API_URL)

if (!response.ok) {
throw new Error('Failed to load books.')
}

const data = await response.json()
setBooks(data)
} catch (error) {
console.error('Error loading books:', error)
alert('Could not load books. Check your backend server.')
}
}, [])

useEffect(() => {
loadBooks()
}, [loadBooks])

// Add or update a book
async function handleSubmit(event) {
event.preventDefault()

if (!title.trim() || !author.trim() || !genre.trim() || !isbn.trim()) {
alert('Please fill in all book details.')
return
}

if (quantity === '' || Number(quantity) <= 0) {
alert('Quantity must be greater than 0.')
return
}

const bookData = {
title: title.trim(),
author: author.trim(),
genre: genre.trim(),
isbn: isbn.trim(),
quantity: Number(quantity),
}

try {
const response = await fetch(
editingId !== null ? `${API_URL}/${editingId}` : API_URL,
{
method: editingId !== null ? 'PUT' : 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(bookData),
}
)

const data = await response.json()

if (!response.ok) {
throw new Error(data.message || 'Something went wrong.')
}

alert(data.message)

clearForm()
setEditingId(null)

await loadBooks()
} catch (error) {
console.error('Book operation failed:', error)
alert(error.message)
}
}

// Edit a book
function editBook(book) {
setTitle(book.title)
setAuthor(book.author)
setGenre(book.genre)
setIsbn(book.isbn)
setQuantity(book.quantity)
setEditingId(book.id)
}

// Delete a book
async function deleteBook(id) {
if (!window.confirm('Are you sure you want to delete this book?')) {
return
}

try {
const response = await fetch(`${API_URL}/${id}`, {
method: 'DELETE',
})

const data = await response.json()

if (!response.ok) {
throw new Error(data.message || 'Failed to delete book.')
}

alert(data.message)
await loadBooks()
} catch (error) {
console.error('Delete failed:', error)
alert(error.message)
}
}

// Clear form
function clearForm() {
setTitle('')
setAuthor('')
setGenre('')
setIsbn('')
setQuantity('')
}

return (
<main className="page-content">
<div className="page-header">
<p className="small-title">LIBRARY</p>
<h1>Book Management</h1>
<p>Add, update and manage books in the library.</p>
</div>

<section className="content-card">
<h2>{editingId !== null ? 'Update Book' : 'Add New Book'}</h2>

<form onSubmit={handleSubmit} className="book-form">
<input
type="text"
placeholder="Book Title"
value={title}
onChange={(event) => setTitle(event.target.value)}
required
/>

<input
type="text"
placeholder="Author"
value={author}
onChange={(event) => setAuthor(event.target.value)}
required
/>

<input
type="text"
placeholder="Genre"
value={genre}
onChange={(event) => setGenre(event.target.value)}
required
/>

<input
type="text"
placeholder="ISBN"
value={isbn}
onChange={(event) => setIsbn(event.target.value)}
required
/>

<input
type="number"
min="1"
placeholder="Initial Quantity"
value={quantity}
onChange={(event) => setQuantity(event.target.value)}
required
/>

<button type="submit">
{editingId !== null ? 'Update Book' : 'Add Book'}
</button>
</form>

<div className="books-list">
<h2>Book List</h2>

{books.length === 0 ? (
<p className="empty-message">
No books have been added yet.
</p>
) : (
books.map((book) => (
<BookCard
key={book.id}
book={book}
onEdit={editBook}
onDelete={deleteBook}
/>
))
)}
</div>
</section>
</main>
)
}

export default Books