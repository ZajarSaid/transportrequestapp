import { NavLink } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">TRS</div>
        <span className="brand-text">Transport Request System</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">Main</span>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">⊞</span>
            Dashboard
          </NavLink>
        </div>

        <div className="nav-section">
          <span className="nav-section-title">Applicant</span>
          <NavLink to="/requests" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">📋</span>
            My Requests
          </NavLink>
          <NavLink to="/requests/new" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">✚</span>
            New Request
          </NavLink>
        </div>

        <div className="nav-section">
          <span className="nav-section-title">Approvals</span>
          <NavLink to="/approvals/leader" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">👤</span>
            Leader Approval
          </NavLink>
          <NavLink to="/approvals/accountant" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">💰</span>
            Accountant Approval
          </NavLink>
        </div>

        <div className="nav-section">
          <span className="nav-section-title">Transport</span>
          <NavLink to="/transport" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">🚗</span>
            Transport Dashboard
          </NavLink>
          <NavLink to="/transport/vehicles" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">🚐</span>
            Vehicles
          </NavLink>
          <NavLink to="/transport/drivers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">🧑‍✈️</span>
            Drivers
          </NavLink>
        </div>

        <div className="nav-section">
          <span className="nav-section-title">Security</span>
          <NavLink to="/security" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">🛡️</span>
            Security Gate
          </NavLink>
        </div>

        <div className="nav-section">
          <span className="nav-section-title">Administration</span>
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">⚙️</span>
            Admin Dashboard
          </NavLink>
          <NavLink to="/admin/requests" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">📄</span>
            All Requests
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
