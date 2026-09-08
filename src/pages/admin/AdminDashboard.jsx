import { Link } from 'react-router-dom'
import { useRequests } from '../../hooks/useRequests'
import DashboardStats from '../../components/DashboardStats'
import StatusBadge from '../../components/StatusBadge'
import { formatDateShort } from '../../utils/formatters'
import './AdminDashboard.css'

function AdminDashboard() {
  const { requests } = useRequests()

  const recent = [...requests]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)

  const statusBreakdown = buildStatusBreakdown(requests)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Admin Dashboard</h2>
          <p className="page-subtitle">
            Internal management overview of all transport requests.
          </p>
        </div>
        <Link to="/admin/requests" className="btn btn-primary">
          Manage All Requests
        </Link>
      </div>

      <DashboardStats requests={requests} />

      <div className="admin-grid">
        <div className="card">
          <div className="home-card-header">
            <h3 className="home-card-title">Recently Updated</h3>
            <Link to="/admin/requests" className="home-card-link">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state compact">
              <p>No requests recorded.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Applicant</th>
                    <th>Destination</th>
                    <th>Travel Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r.id}>
                      <td className="ref-cell">
                        <Link to={`/admin/requests/${r.id}`}>
                          {r.referenceNumber}
                        </Link>
                      </td>
                      <td>{r.applicant?.name}</td>
                      <td>{r.trip?.destination}</td>
                      <td>{formatDateShort(r.trip?.travelDate)}</td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card status-card-admin">
          <h3 className="home-card-title">Status Breakdown</h3>
          <div className="status-breakdown">
            {Object.entries(statusBreakdown).map(([status, count]) => (
              <div className="status-bar-row" key={status}>
                <span className="status-bar-label">{status}</span>
                <div className="status-bar-track">
                  <div
                    className="status-bar-fill"
                    style={{
                      width: `${count.total ? Math.max(4, (count.count / count.total) * 100) : 0}%`,
                    }}
                  />
                </div>
                <span className="status-bar-count">{count.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function buildStatusBreakdown(requests) {
  const counts = {}
  for (const r of requests) {
    counts[r.status] = (counts[r.status] || 0) + 1
  }
  const total = requests.length || 1
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [status, count]) => {
      acc[status] = { count, total }
      return acc
    }, {})
}

export default AdminDashboard