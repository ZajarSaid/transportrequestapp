import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiFileText,
  FiPlusSquare,
  FiUser,
  FiDollarSign,
  FiTruck,
  FiBox,
  FiUsers,
  FiShield,
  FiSettings,
  FiList,
} from "react-icons/fi";
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) onClose();
  };

  return (
    <aside className={`sidebar${isOpen ? " sidebar-open" : ""}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">TRS</div>
        <span className="brand-text">Transport Request System</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section" data-accent="blue">
          <span className="nav-section-title">Main</span>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleLinkClick}
          >
            <FiGrid className="nav-icon" />
            Dashboard
          </NavLink>
        </div>

        <div className="nav-section" data-accent="violet">
          <span className="nav-section-title">Applicant</span>
          <NavLink
            to="/requests"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleLinkClick}
          >
            <FiFileText className="nav-icon" />
            My Requests
          </NavLink>
          <NavLink
            to="/requests/new"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleLinkClick}
          >
            <FiPlusSquare className="nav-icon" />
            New Request
          </NavLink>
        </div>

        <div className="nav-section" data-accent="pink">
          <span className="nav-section-title">Approvals</span>
          <NavLink
            to="/approvals/leader"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleLinkClick}
          >
            <FiUser className="nav-icon" />
            Leader Approval
          </NavLink>
          <NavLink
            to="/approvals/accountant"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleLinkClick}
          >
            <FiDollarSign className="nav-icon" />
            Accountant Approval
          </NavLink>
        </div>

        <div className="nav-section" data-accent="emerald">
          <span className="nav-section-title">Transport</span>
          <NavLink
            to="/transport"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleLinkClick}
          >
            <FiTruck className="nav-icon" />
            Transport Dashboard
          </NavLink>
          <NavLink
            to="/transport/vehicles"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleLinkClick}
          >
            <FiBox className="nav-icon" />
            Vehicles
          </NavLink>
          <NavLink
            to="/transport/drivers"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleLinkClick}
          >
            <FiUsers className="nav-icon" />
            Drivers
          </NavLink>
        </div>

        <div className="nav-section" data-accent="amber">
          <span className="nav-section-title">Security</span>
          <NavLink
            to="/security"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleLinkClick}
          >
            <FiShield className="nav-icon" />
            Security Gate
          </NavLink>
        </div>

        <div className="nav-section" data-accent="rose">
          <span className="nav-section-title">Administration</span>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleLinkClick}
          >
            <FiSettings className="nav-icon" />
            Admin Dashboard
          </NavLink>
          <NavLink
            to="/admin/requests"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleLinkClick}
          >
            <FiList className="nav-icon" />
            All Requests
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
