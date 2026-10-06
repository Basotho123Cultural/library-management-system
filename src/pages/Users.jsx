import { useState, useEffect } from 'react'
import UserCard from '../components/UserCard'

function Users() {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users')
    return savedUsers ? JSON.parse(savedUsers) : []
  })

  const [name, setName] = useState('')
  const [membershipId, setMembershipId] = useState('')
  const [role, setRole] = useState('Member')
  const [editingId, setEditingId] = useState(null)

  const [loginId, setLoginId] = useState('')
  const [loginMessage, setLoginMessage] = useState('')

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim() || !membershipId.trim()) {
      alert('Please fill in all user details.')
      return
    }

    if (editingId !== null) {
      setUsers(
        users.map((user) =>
          user.id === editingId
            ? {
                ...user,
                name: name.trim(),
                membershipId: membershipId.trim(),
                role,
              }
            : user
        )
      )

      alert('User updated successfully!')
      setEditingId(null)
    } else {
      const newUser = {
        id: Date.now(),
        name: name.trim(),
        membershipId: membershipId.trim(),
        role,
      }

      setUsers([...users, newUser])

      alert('User added successfully!')
    }

    clearForm()
  }

  function editUser(user) {
    setName(user.name)
    setMembershipId(user.membershipId)
    setRole(user.role)
    setEditingId(user.id)
  }

  function deleteUser(id) {
    setUsers(users.filter((user) => user.id !== id))
  }

  function clearForm() {
    setName('')
    setMembershipId('')
    setRole('Member')
  }

  function handleLogin(event) {
    event.preventDefault()

    const user = users.find(
      (item) =>
        item.membershipId.toLowerCase() ===
        loginId.trim().toLowerCase()
    )

    if (!user) {
      setLoginMessage(
        'User not found. Please check the membership ID.'
      )
      return
    }

    setLoginMessage(`Welcome, ${user.name}!`)
    setLoginId('')
  }

  return (
    <main className="page-content">
      <div className="page-header">
        <p className="small-title">LIBRARY USERS</p>
        <h1>User Management</h1>
        <p>Manage library members, librarians and user accounts.</p>
      </div>

      <section className="content-card">
        <h2>Login</h2>

        <form className="user-login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Membership ID"
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
          />

          <button type="submit">
            Login
          </button>
        </form>

        {loginMessage && (
          <p className="login-message">
            {loginMessage}
          </p>
        )}
      </section>

      <section className="content-card user-management-card">
        <h2>{editingId !== null ? 'Update User' : 'Add New User'}</h2>

        <form className="user-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            type="text"
            placeholder="Membership ID"
            value={membershipId}
            onChange={(event) =>
              setMembershipId(event.target.value)
            }
          />

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="Member">Member</option>
            <option value="Librarian">Librarian</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit">
            {editingId !== null ? 'Update User' : 'Add User'}
          </button>
        </form>
      </section>

      <section className="content-card users-list">
        <h2>User List</h2>

        {users.length === 0 ? (
          <p className="empty-message">
            No users have been added yet.
          </p>
        ) : (
          users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={editUser}
              onDelete={deleteUser}
            />
          ))
        )}
      </section>
    </main>
  )
}

export default Users