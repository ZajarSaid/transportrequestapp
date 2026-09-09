import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopNav from '../components/TopNav'
import './MainLayout.css'

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="app-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="main-area">
        <TopNav onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        <main className="main-content" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
