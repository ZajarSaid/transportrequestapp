import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopNav from '../components/TopNav'
import './MainLayout.css'

function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopNav />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
