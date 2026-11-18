function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="user-item">
      <div>
        <h3>{user.name}</h3>
        <p>Membership ID: {user.membershipId}</p>
        <p>Role: {user.role}</p>
      </div>

      <div>
        <button
          className="edit-button"
          onClick={() => onEdit(user)}
        >
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() => onDelete(user.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default UserCard