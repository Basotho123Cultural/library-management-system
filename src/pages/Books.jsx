import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'

function Books() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem('books')
    return savedBooks ? JSON.parse(savedBooks) : []
  })

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [isbn, setIsbn] = useState('')
  const [quantity, setQuantity] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books))
  }, [books])

  function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim() || !author.trim() || !genre.trim() || !isbn.trim()) {
      alert('Please fill in all book details.')
      return
    }

    if (quantity === '' || Number(quantity) <= 0) {
      alert('Quantity must be greater than 0.')
      return
    }

    if (editingId !== null) {
      setBooks(
        books.map((book) =>
          book.id === editingId
            ? {
                ...book,
                title: title.trim(),
                author: author.trim(),
                genre: genre.trim(),
                isbn: isbn.trim(),
                quantity: Number(quantity),
              }
            : book
        )
      )

      alert('Book updated successfully!')
      setEditingId(null)
    } else {
      const newBook = {
        id: Date.now(),
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim(),
        isbn: isbn.trim(),
        quantity: Number(quantity),
      }

      setBooks([...books, newBook])
      alert('Book added successfully!')
    }

    clearForm()
  }

  function editBook(book) {
    setTitle(book.title)
    setAuthor(book.author)
    setGenre(book.genre)
    setIsbn(book.isbn)
    setQuantity(book.quantity)
    setEditingId(book.id)
  }

  function deleteBook(id) {
    setBooks(books.filter((book) => book.id !== id))
  }

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
          />

          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />

          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          />

          <input
            type="text"
            placeholder="ISBN"
            value={isbn}
            onChange={(event) => setIsbn(event.target.value)}
          />

          <input
            type="number"
            min="1"
            placeholder="Initial Quantity"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
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