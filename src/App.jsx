import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import RequestList from './pages/requests/RequestList'
import NewRequest from './pages/requests/NewRequest'
import EditRequest from './pages/requests/EditRequest'
import RequestDetail from './pages/requests/RequestDetail'
import RequestStatus from './pages/requests/RequestStatus'
import PrintRequest from './pages/requests/PrintRequest'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRequests from './pages/admin/AdminRequests'
import AdminRequestDetail from './pages/admin/AdminRequestDetail'
import LeaderApproval from './pages/approvals/LeaderApproval'
import AccountantApproval from './pages/approvals/AccountantApproval'
import TransportDashboard from './pages/transport/TransportDashboard'
import VehicleList from './pages/transport/VehicleList'
import DriverList from './pages/transport/DriverList'
import SecurityCheck from './pages/security/SecurityCheck'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/requests" element={<RequestList />} />
        <Route path="/requests/new" element={<NewRequest />} />
        <Route path="/requests/:id/edit" element={<EditRequest />} />
        <Route path="/requests/:id" element={<RequestDetail />} />
        <Route path="/requests/:id/status" element={<RequestStatus />} />
        <Route path="/requests/:id/print" element={<PrintRequest />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/requests/:id" element={<AdminRequestDetail />} />

        <Route path="/approvals/leader" element={<LeaderApproval />} />
        <Route path="/approvals/accountant" element={<AccountantApproval />} />

        <Route path="/transport" element={<TransportDashboard />} />
        <Route path="/transport/vehicles" element={<VehicleList />} />
        <Route path="/transport/drivers" element={<DriverList />} />

        <Route path="/security" element={<SecurityCheck />} />
        <Route path="/security/check" element={<SecurityCheck />} />
      </Route>
    </Routes>
  )
}

export default App
