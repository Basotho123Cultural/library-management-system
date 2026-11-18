import { useState, useEffect } from 'react'
import UserCard from '../components/UserCard'

const defaultAdmin = {
  id: 'admin-default',
  name: 'System Administrator',
  membershipId: 'ADMIN001',
  password: 'Admin123',
  role: 'Admin',
}

function Users() {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users')

    if (savedUsers) {
      return JSON.parse(savedUsers)
    }

    return [defaultAdmin]
  })

  const [name, setName] = useState('')
  const [membershipId, setMembershipId] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Member')
  const [editingId, setEditingId] = useState(null)

  const [loginId, setLoginId] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginMessage, setLoginMessage] = useState('')

  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = sessionStorage.getItem('loggedInUser')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  function handleSubmit(event) {
    event.preventDefault()

    if (
      !name.trim() ||
      !membershipId.trim() ||
      !password.trim()
    ) {
      alert('Please fill in all user details.')
      return
    }

    if (password.trim().length < 6) {
      alert('Password must be at least 6 characters long.')
      return
    }

    const duplicateUser = users.find(
      (user) =>
        user.membershipId.toLowerCase() ===
          membershipId.trim().toLowerCase() &&
        user.id !== editingId
    )

    if (duplicateUser) {
      alert('This membership ID is already in use.')
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
                password: password.trim(),
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
        password: password.trim(),
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
    setPassword(user.password || '')
    setRole(user.role)
    setEditingId(user.id)
  }

  function deleteUser(id) {
    if (loggedInUser?.role !== 'Admin') {
      alert('Only an Admin can delete users.')
      return
    }

    if (id === loggedInUser.id) {
      alert('You cannot delete the account currently in use.')
      return
    }

    setUsers(users.filter((user) => user.id !== id))
  }

  function clearForm() {
    setName('')
    setMembershipId('')
    setPassword('')
    setRole('Member')
  }

  function handleLogin(event) {
    event.preventDefault()

    if (!loginId.trim() || !loginPassword.trim()) {
      setLoginMessage(
        'Please enter your membership ID and password.'
      )
      return
    }

    const user = users.find(
      (item) =>
        item.membershipId.toLowerCase() ===
          loginId.trim().toLowerCase() &&
        item.password === loginPassword
    )

    if (!user) {
      setLoginMessage('Invalid membership ID or password.')
      return
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      membershipId: user.membershipId,
      role: user.role,
    }

    sessionStorage.setItem(
      'loggedInUser',
      JSON.stringify(sessionUser)
    )

    setLoggedInUser(sessionUser)
    setLoginMessage(`Welcome, ${user.name}!`)
    setLoginId('')
    setLoginPassword('')
  }

  function handleLogout() {
    sessionStorage.removeItem('loggedInUser')
    setLoggedInUser(null)
    setLoginMessage('')
  }

  const canManageUsers =
    loggedInUser?.role === 'Admin'

  return (
    <main className="page-content">
      <div className="page-header">
        <p className="small-title">LIBRARY USERS</p>

        <h1>User Management</h1>

        <p>
          Manage library members, librarians and user accounts.
        </p>
      </div>

      <section className="content-card">
        <h2>
          {loggedInUser
            ? `Welcome, ${loggedInUser.name}`
            : 'Login'}
        </h2>

        {!loggedInUser ? (
          <form
            className="user-login-form"
            onSubmit={handleLogin}
          >
            <input
              type="text"
              placeholder="Membership ID"
              value={loginId}
              onChange={(event) =>
                setLoginId(event.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(event) =>
                setLoginPassword(event.target.value)
              }
            />

            <button type="submit">
              Login
            </button>
          </form>
        ) : (
          <div className="logged-in-user">
            <p>
              Role: <strong>{loggedInUser.role}</strong>
            </p>

            <button
              className="delete-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}

        {loginMessage && (
          <p className="login-message">
            {loginMessage}
          </p>
        )}
      </section>

      {canManageUsers && (
        <section className="content-card user-management-card">
          <h2>
            {editingId !== null
              ? 'Update User'
              : 'Add New User'}
          </h2>

          <form
            className="user-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

            <input
              type="text"
              placeholder="Membership ID"
              value={membershipId}
              onChange={(event) =>
                setMembershipId(event.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password (minimum 6 characters)"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

            <select
              value={role}
              onChange={(event) =>
                setRole(event.target.value)
              }
            >
              <option value="Member">Member</option>
              <option value="Librarian">Librarian</option>
              <option value="Admin">Admin</option>
            </select>

            <button type="submit">
              {editingId !== null
                ? 'Update User'
                : 'Add User'}
            </button>
          </form>
        </section>
      )}

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
              onEdit={
                canManageUsers
                  ? editUser
                  : () =>
                      alert(
                        'Only an Admin can edit users.'
                      )
              }
              onDelete={deleteUser}
            />
          ))
        )}
      </section>
    </main>
  )
}

export default Users