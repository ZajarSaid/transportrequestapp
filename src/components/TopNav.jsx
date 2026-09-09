import './TopNav.css'

function TopNav({ onMenuToggle }) {
  return (
    <header className="topnav">
      <div className="topnav-left">
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          <span className="menu-bar" />
          <span className="menu-bar" />
          <span className="menu-bar" />
        </button>
        <h1 className="topnav-title">Transport Request Management</h1>
      </div>
      <div className="topnav-right">
        <div className="topnav-user">
          <span className="user-avatar">JD</span>
          <span className="user-name">John Doe</span>
        </div>
      </div>
    </header>
  )
}

export default TopNav
