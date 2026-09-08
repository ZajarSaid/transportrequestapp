import './TopNav.css'

function TopNav() {
  return (
    <header className="topnav">
      <div className="topnav-left">
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
