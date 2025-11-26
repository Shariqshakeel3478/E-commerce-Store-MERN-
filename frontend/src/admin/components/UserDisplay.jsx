import "./userDisplay.css";

export default function UserDisplay({ users }) {
    return (
        <div className="user-display">
            <h2 className="title">Registered Users</h2>

            <div className="table-wrapper">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td className="user-info">
                                        <div className="avatar">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    user.name
                                                )}&background=1d4ed8&color=fff`}
                                                alt={user.name}
                                            />
                                        </div>
                                        <span className="user-name">{user.name}</span>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role?.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="status-dot active"></span> Active
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-users">
                                    No users found 😕
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
