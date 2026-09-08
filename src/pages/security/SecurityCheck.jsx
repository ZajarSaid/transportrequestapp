import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRequests } from '../../hooks/useRequests'
import { useFleet } from '../../hooks/useFleet'
import StatusBadge from '../../components/StatusBadge'
import { REQUEST_STATUSES } from '../../utils/statusConfig'
import './SecurityCheck.css'

const GATE_STATUSES = ['Cleared', 'Held']

function SecurityCheck() {
  const { requests, recordSecurityCheck } = useRequests()
  const { vehicles, drivers } = useFleet()
  const [selectedId, setSelectedId] = useState(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const eligible = requests.filter(
    (r) => r.status === REQUEST_STATUSES.READY_FOR_TRIP,
  )

  const selected =
    eligible.find((r) => r.id === selectedId) || eligible[0] || null

  const handleCheck = (check) => {
    if (!selected) return
    setError(null)
    setMessage(null)
    try {
      const updated = recordSecurityCheck(selected.id, check)
      setMessage(
        check.gateStatus === 'Cleared'
          ? `Request ${updated.referenceNumber} cleared — trip completed.`
          : `Request ${updated.referenceNumber} held for review.`,
      )
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Security Gate</h2>
          <p className="page-subtitle">
            Verify outgoing trips. Only transport-approved requests are eligible.
          </p>
        </div>
      </div>

      {message && <div className="action-message success">{message}</div>}
      {error && <div className="action-message error">{error}</div>}

      {eligible.length === 0 ? (
        <div className="empty-state card">
          <p>
            No trips are ready at the gate. Requests appear here once transport
            has been approved.
          </p>
        </div>
      ) : (
        <div className="security-layout">
          <div className="security-queue">
            {eligible.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`queue-card card ${r.id === selected?.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(r.id)}
              >
                <div className="queue-top">
                  <span className="queue-reference">{r.referenceNumber}</span>
                  <StatusBadge status={r.status} />
                </div>
                <div className="queue-line">
                  <span className="queue-label">Applicant</span>
                  <span className="queue-value">{r.applicant?.name}</span>
                </div>
                <div className="queue-line">
                  <span className="queue-label">Destination</span>
                  <span className="queue-value">{r.trip?.destination}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="security-panel">
            {selected && <GateCheckPanel request={selected} vehicles={vehicles} drivers={drivers} onCheck={handleCheck} />}
          </div>
        </div>
      )}
    </div>
  )
}

function GateCheckPanel({ request, vehicles, drivers, onCheck }) {
  const allocation = request.transportAllocation || {}
  const vehicle = vehicles.find((v) => v.id === allocation.vehicleId)
  const driver = drivers.find((d) => d.id === allocation.driverId)
  const [checkedBy, setCheckedBy] = useState('')
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 16),
  )
  const [gateStatus, setGateStatus] = useState(GATE_STATUSES[0])
  const [comment, setComment] = useState('')

  const canSubmit = checkedBy.trim() && date && gateStatus

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    onCheck({
      checkedBy: checkedBy.trim(),
      date,
      gateStatus,
      comment: comment.trim(),
    })
  }

  return (
    <div className="card">
      <h3 className="action-panel-title">
        Gate Verification — {request.referenceNumber}
      </h3>

      <div className="gate-details">
        <div className="gate-grid">
          <div className="gate-field">
            <span className="gate-label">Applicant</span>
            <span className="gate-value">{request.applicant?.name}</span>
          </div>
          <div className="gate-field">
            <span className="gate-label">Destination</span>
            <span className="gate-value">{request.trip?.destination}</span>
          </div>
          <div className="gate-field">
            <span className="gate-label">Travel Date</span>
            <span className="gate-value">{request.trip?.travelDate}</span>
          </div>
          <div className="gate-field">
            <span className="gate-label">Passengers</span>
            <span className="gate-value">{request.trip?.passengerCount}</span>
          </div>
          <div className="gate-field">
            <span className="gate-label">Vehicle</span>
            <span className="gate-value">
              {allocation.vehicleName ||
                (vehicle
                  ? `${vehicle.type} · ${vehicle.registration}`
                  : '—')}
            </span>
          </div>
          <div className="gate-field">
            <span className="gate-label">Driver</span>
            <span className="gate-value">
              {allocation.driverName || driver?.name || '—'}
            </span>
          </div>
          <div className="gate-field">
            <span className="gate-label">Approval Status</span>
            <span className="gate-value">
              <StatusBadge status={request.status} />
            </span>
          </div>
          <div className="gate-field">
            <span className="gate-label">Pending Instructions</span>
            <span className="gate-value">
              {allocation.instructions || 'None'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="gate-form">
        <div className="gate-form-grid">
          <div className="form-field">
            <label className="form-label">
              Checked By<span className="form-required">*</span>
            </label>
            <input
              className="form-control"
              type="text"
              value={checkedBy}
              onChange={(e) => setCheckedBy(e.target.value)}
              placeholder="Security officer name"
            />
          </div>
          <div className="form-field">
            <label className="form-label">
              Date / Time<span className="form-required">*</span>
            </label>
            <input
              className="form-control"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">
              Gate Status<span className="form-required">*</span>
            </label>
            <select
              className="form-control"
              value={gateStatus}
              onChange={(e) => setGateStatus(e.target.value)}
            >
              {GATE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field gate-comment">
            <label className="form-label">Comment</label>
            <textarea
              className="form-control"
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional comment..."
            />
          </div>
        </div>

        <div className="gate-actions">
          <Link
            to={`/requests/${request.id}`}
            className="btn btn-secondary"
          >
            View Full Details
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!canSubmit}
          >
            Record Gate Check
          </button>
        </div>
      </form>
    </div>
  )
}

export default SecurityCheck