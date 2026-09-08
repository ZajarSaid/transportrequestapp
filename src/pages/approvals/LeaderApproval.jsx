import { useState } from 'react'
import { useRequests } from '../../hooks/useRequests'
import RequestSummaryCard from '../../components/RequestSummaryCard'
import ApprovalAction from '../../components/ApprovalAction'
import StatusBadge from '../../components/StatusBadge'
import { REQUEST_STATUSES } from '../../utils/statusConfig'
import './ApprovalPage.css'

function LeaderApproval() {
  const { requests, setLeaderApproval } = useRequests()
  const [selectedId, setSelectedId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  const pending = requests.filter((r) =>
    [REQUEST_STATUSES.SUBMITTED, REQUEST_STATUSES.PENDING_LEADER].includes(
      r.status,
    ),
  )

  const selected =
    pending.find((r) => r.id === selectedId) || pending[0] || null

  const handleAction = (approved) => (decision) => {
    if (!selected) return
    setBusy(true)
    setMessage(null)
    const approval = {
      approved,
      comment: decision.comment || '',
      name: 'Current Leader',
      date: new Date().toISOString(),
    }
    const updated = setLeaderApproval(selected.id, approval)
    setBusy(false)
    setMessage(
      `Request ${updated.referenceNumber} was ${
        approved ? 'approved & recommended' : 'rejected'
      }.`,
    )
    setSelectedId(null)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Leader Recommendation</h2>
          <p className="page-subtitle">
            Review submitted requests and provide your recommendation before
            they proceed to funds confirmation.
          </p>
        </div>
      </div>

      {message && <div className="action-message success">{message}</div>}

      {pending.length === 0 ? (
        <div className="empty-state card">
          <p>No requests are waiting for leader recommendation.</p>
        </div>
      ) : (
        <div className="approval-layout">
          <div className="approval-queue">
            {pending.map((r) => (
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
                <div className="queue-line">
                  <span className="queue-label">Travel Date</span>
                  <span className="queue-value">{r.trip?.travelDate}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="approval-panel">
            {selected ? (
              <>
                <RequestSummaryCard request={selected} />
                <div className="card action-panel">
                  <h3 className="action-panel-title">
                    {selected.referenceNumber} — Your Recommendation
                  </h3>
                  <ApprovalAction
                    approveLabel="Approve & Recommend"
                    rejectLabel="Reject"
                    onApprove={handleAction(true)}
                    onReject={handleAction(false)}
                    busy={busy}
                  />
                </div>
              </>
            ) : (
              <div className="empty-state card">
                <p>Select a request from the queue to review.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaderApproval