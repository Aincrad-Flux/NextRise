import TopBar from "../components/TopBar.jsx"
import Sidebar from "../components/Sidebar.jsx"

export default function AdminGeneral(){
    const user = { firstName: 'John', lastName: 'Doe', role: 'admin' };
    const handleLogout = () => alert('Logout... (to implement)');

    return (
        <div className="home-container">
            <TopBar />
            <div className="layout">
                <Sidebar active="admin" user={user} onLogout={handleLogout} />
            </div>
            <h1>GENERAL</h1>
        </div>
    )
}
