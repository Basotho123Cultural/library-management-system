import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Transactions from './pages/Transactions'
import Users from './pages/Users'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App