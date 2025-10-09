
import "./userDisplay.css";


export default function UserDisplay({ users, setUsers }) {


    return (
        <div className="user-display">
            <h2 className="title">Registered Users</h2>
            <div className="user-grid">
                {users.map((user) => (
                    <div key={user.id} className="user-card">
                        <div className="avatar">{user.name?.charAt(0)}</div>
                        <div className="user-info">
                            <h3 className="user-name">{user.name}</h3>
                            <p className="user-email">{user.email}</p>
                            <span className={`role-badge ${user.role?.toLowerCase()}`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
