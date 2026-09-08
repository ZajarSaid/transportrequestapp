import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRequests } from '../../hooks/useRequests'
import StatusBadge from '../../components/StatusBadge'
import { REQUEST_STATUSES } from '../../utils/statusConfig'
import './RequestList.css'

function RequestList() {
  const { requests, loading, error, submitRequest, removeRequest, resetRequests } =
    useRequests()
  const [message, setMessage] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">Loading requests...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-state">
          <p>{error}</p>
          <p>Please try again.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = (req) => {
    setMessage(null)
    setErrorMsg(null)
    try {
      const updated = submitRequest(req.id)
      setMessage(
        `Request ${updated.referenceNumber} submitted and is now waiting for leader recommendation.`,
      )
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  const handleDelete = (req) => {
    setMessage(null)
    setErrorMsg(null)
    const confirmed = window.confirm(
      `Delete draft ${req.referenceNumber}? This action cannot be undone.`,
    )
    if (!confirmed) return
    removeRequest(req.id)
    setMessage(`Draft ${req.referenceNumber} deleted.`)
  }

  const handleReset = () => {
    setMessage(null)
    setErrorMsg(null)
    const confirmed = window.confirm(
      'Delete all requests? This cannot be undone.',
    )
    if (!confirmed) return
    resetRequests()
    setMessage('All requests deleted.')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">My Requests</h2>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleReset}>
            Delete All Requests
          </button>
          <Link to="/requests/new" className="btn btn-primary">
            ＋ New Request
          </Link>
        </div>
      </div>

      {message && <div className="action-message success">{message}</div>}
      {errorMsg && <div className="action-message error">{errorMsg}</div>}

      {requests.length === 0 ? (
        <div className="empty-state card">
          <p>You have no transport requests yet.</p>
          <Link to="/requests/new" className="btn btn-primary">
            Create your first request
          </Link>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Applicant</th>
                  <th>Destination</th>
                  <th>Travel Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td className="ref-cell">{req.referenceNumber}</td>
                    <td>{req.applicant?.name}</td>
                    <td>{req.trip?.destination}</td>
                    <td>{req.trip?.travelDate}</td>
                    <td>
                      <StatusBadge status={req.status} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link to={`/requests/${req.id}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                        {req.status === REQUEST_STATUSES.DRAFT && (
                          <>
                            <Link
                              to={`/requests/${req.id}/edit`}
                              className="btn btn-secondary btn-sm"
                            >
                              Edit
                            </Link>
                            <button
                              className="btn btn-secondary btn-sm btn-delete"
                              onClick={() => handleDelete(req)}
                            >
                              Delete
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleSubmit(req)}
                            >
                              Submit
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default RequestList
