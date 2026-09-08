import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TransportRequestForm from '../../components/TransportRequestForm'
import * as requestService from '../../services/requestService'
import { REQUEST_STATUSES } from '../../utils/statusConfig'
import './EditRequest.css'

function EditRequest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const request = requestService.getRequestById(id)

  if (!request) {
    return (
      <div className="page">
        <div className="not-found card">
          <h2 className="page-title">Request Not Found</h2>
          <p>The request you are looking for does not exist.</p>
          <Link to="/requests" className="btn btn-secondary">
            Back to My Requests
          </Link>
        </div>
      </div>
    )
  }

  if (request.status !== REQUEST_STATUSES.DRAFT) {
    return (
      <div className="page">
        <div className="notice card">
          <h2 className="page-title">Cannot Edit</h2>
          <p className="notice-text">
            This request has already been submitted, so it can no longer be
            edited. Only draft requests can be modified before submission.
          </p>
          <Link to={`/requests/${id}`} className="btn btn-secondary">
            View Request
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = (requestData) => {
    const updated = requestService.updateRequest(id, {
      applicant: requestData.applicant,
      trip: requestData.trip,
      passengers: requestData.passengers,
      applicantDeclaration: requestData.applicantDeclaration,
      status: REQUEST_STATUSES.DRAFT,
    })
    setSaved(updated)
  }

  if (saved) {
    return (
      <div className="page">
        <div className="card success-panel">
          <div className="success-icon">✓</div>
          <h2 className="page-title">Changes Saved</h2>
          <p className="success-reference">
            Reference Number: <strong>{saved.referenceNumber}</strong>
          </p>
          <p className="success-text">
            Your draft has been updated. Submit it from My Requests when you
            are ready.
          </p>
          <div className="success-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/requests/${id}`)}
            >
              View Request
            </button>
            <Link className="btn btn-secondary" to="/requests">
              Back to My Requests
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Edit Transport Request</h2>
        <p className="page-subtitle">
          Edit draft {request.referenceNumber}. Changes are only possible while
          the request is still a draft.
        </p>
      </div>
      <TransportRequestForm
        onSubmit={handleSubmit}
        initialData={request}
        initialReference={request.referenceNumber}
        submitLabel="Save Changes"
      />
    </div>
  )
}

export default EditRequest