function BookCard({ book, onEdit, onDelete }) {
  return (
    <div className="book-item">
      <h3>{book.title}</h3>

      <p>Author: {book.author}</p>
      <p>Genre: {book.genre}</p>
      <p>ISBN: {book.isbn}</p>
      <p>Available: {book.quantity}</p>

      <button
        className="edit-button"
        onClick={() => onEdit(book)}
      >
        Edit
      </button>

      <button
        className="delete-button"
        onClick={() => onDelete(book.id)}
      >
        Delete
      </button>
    </div>
  )
}

export default BookCard