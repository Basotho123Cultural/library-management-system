import { useState, useEffect } from 'react'

function Dashboard() {
  const [books, setBooks] = useState([])

  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const savedBooks = localStorage.getItem('books')
    const savedTransactions = localStorage.getItem('transactions')

    if (savedBooks) {
      setBooks(JSON.parse(savedBooks))
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  const totalBooks = books.length

  const availableBooks = books.reduce(
    (total, book) => total + book.quantity,
    0
  )

  const borrowedBooks = transactions
    .filter((transaction) => transaction.action === 'Book Borrowed')
    .reduce(
      (total, transaction) => total + transaction.quantity,
      0
    )

  const lowStockBooks = books.filter(
    (book) => book.quantity < 2
  )

  return (
    <main className="library-content">
      <section className="welcome-section">
        <div>
          <p className="welcome-label">COMMUNITY LIBRARY</p>

          <h1>Library Management System</h1>

          <p className="welcome-text">
            Manage books, availability and library users in one place.
          </p>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <p className="small-title">OVERVIEW</p>
          <h2>Library Dashboard</h2>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <span className="card-label">TOTAL BOOK TITLES</span>
            <strong>{totalBooks}</strong>
            <p>Books registered in the library</p>
          </div>

          <div className="dashboard-card">
            <span className="card-label">AVAILABLE COPIES</span>
            <strong>{availableBooks}</strong>
            <p>Copies currently available</p>
          </div>

          <div className="dashboard-card">
            <span className="card-label">BORROWED COPIES</span>
            <strong>{borrowedBooks}</strong>
            <p>Copies borrowed from the library</p>
          </div>
        </div>

        <div className="dashboard-low-stock">
          <div className="section-heading">
            <p className="small-title">STOCK ALERT</p>
            <h2>Low Stock Books</h2>
          </div>

          {lowStockBooks.length === 0 ? (
            <div className="low-stock-empty">
              <p>All books have sufficient stock.</p>
            </div>
          ) : (
            <div className="low-stock-list">
              {lowStockBooks.map((book) => (
                <div className="low-stock-item" key={book.id}>
                  <div>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                  </div>

                  <strong>{book.quantity} left</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Dashboard