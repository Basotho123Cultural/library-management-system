function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logo-mark">L</span>
        <span>Library Management</span>
      </div>

      <div className="nav-links">
        <a href="/">Dashboard</a>
        <a href="/books">Books</a>
        <a href="/transactions">Transactions</a>
        <a href="/users">Users</a>
      </div>
    </nav>
  )
}

export default Navbar