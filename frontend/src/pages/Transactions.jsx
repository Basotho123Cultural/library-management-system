import { useState, useEffect } from 'react'

function Transactions() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem('books')
    return savedBooks ? JSON.parse(savedBooks) : []
  })

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions')
    return savedTransactions ? JSON.parse(savedTransactions) : []
  })

  const [selectedBook, setSelectedBook] = useState('')
  const [amount, setAmount] = useState('')
  const [action, setAction] = useState('add')

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books))
  }, [books])

  useEffect(() => {
    localStorage.setItem(
      'transactions',
      JSON.stringify(transactions)
    )
  }, [transactions])

  function handleTransaction(event) {
    event.preventDefault()

    if (!selectedBook || amount === '') {
      alert('Please select a book and enter a quantity.')
      return
    }

    if (Number(amount) <= 0) {
      alert('Quantity must be greater than 0.')
      return
    }

    const selected = books.find(
      (book) => book.id === Number(selectedBook)
    )

    if (!selected) {
      alert('Book not found.')
      return
    }

    const transactionAmount = Number(amount)

    if (
      action === 'borrow' &&
      transactionAmount > selected.quantity
    ) {
      alert('There is not enough stock available.')
      return
    }

    const updatedBooks = books.map((book) => {
      if (book.id === selected.id) {
        return {
          ...book,
          quantity:
            action === 'add'
              ? book.quantity + transactionAmount
              : book.quantity - transactionAmount,
        }
      }

      return book
    })

    setBooks(updatedBooks)

    const newTransaction = {
      id: Date.now(),
      bookTitle: selected.title,
      action: action === 'add' ? 'Stock Added' : 'Book Borrowed',
      quantity: transactionAmount,
      date: new Date().toLocaleString(),
    }

    setTransactions([newTransaction, ...transactions])

    setSelectedBook('')
    setAmount('')

    alert('Transaction recorded successfully!')
  }

  return (
    <main className="page-content">
      <div className="page-header">
        <p className="small-title">LIBRARY ACTIVITY</p>
        <h1>Transactions</h1>
        <p>Track books being added and borrowed.</p>
      </div>

      <section className="content-card">
        <h2>Manage Stock</h2>

        {books.length === 0 ? (
          <p className="empty-message">
            Add a book first before recording a transaction.
          </p>
        ) : (
          <form
            onSubmit={handleTransaction}
            className="transaction-form"
          >
            <select
              value={selectedBook}
              onChange={(event) =>
                setSelectedBook(event.target.value)
              }
            >
              <option value="">Select Book</option>

              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} — Available: {book.quantity}
                </option>
              ))}
            </select>

            <select
              value={action}
              onChange={(event) =>
                setAction(event.target.value)
              }
            >
              <option value="add">Transaction Type: Add Stock</option>
              <option value="borrow">Transaction Type: Borrow Book</option>
            </select>

            <input
              type="number"
              min="1"
              placeholder="Enter Quantity"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />

            <button type="submit">
              Record Transaction
            </button>
          </form>
        )}
      </section>

      <section className="content-card transaction-history">
        <h2>Transaction History</h2>

        {transactions.length === 0 ? (
          <p className="empty-message">
            No transactions have been recorded yet.
          </p>
        ) : (
          transactions.map((transaction) => (
            <div
              className="transaction-item"
              key={transaction.id}
            >
              <div>
                <h3>{transaction.bookTitle}</h3>
                <p>{transaction.action}</p>
              </div>

              <div>
                <strong>{transaction.quantity}</strong>
                <p>{transaction.date}</p>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  )
}

export default Transactions