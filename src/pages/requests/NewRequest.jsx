import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TransportRequestForm from '../../components/TransportRequestForm'
import * as requestService from '../../services/requestService'
import './NewRequest.css'

function NewRequest() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(null)

  const handleSubmit = (requestData) => {
    const created = requestService.createRequest(requestData)
    setSubmitted(created)
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="card success-panel">
          <div className="success-icon">✓</div>
          <h2 className="page-title">Request Saved as Draft</h2>
          <p className="success-reference">
            Reference Number: <strong>{submitted.referenceNumber}</strong>
          </p>
          <p className="success-text">
            Your transport request has been saved as a draft. Go to My Requests
            and click <strong>Submit</strong> to send it for leader
            recommendation.
          </p>
          <div className="success-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                setSubmitted(null)
                navigate('/requests/new')
              }}
            >
              Create Another Request
            </button>
            <Link className="btn btn-secondary" to="/requests">
              View My Requests
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">New Transport Request</h2>
        <p className="page-subtitle">
          Complete all sections below. Required fields are marked with an
          asterisk (*).
        </p>
      </div>
      <TransportRequestForm
        onSubmit={handleSubmit}
        existingRequests={requestService.getRequests()}
      />
    </div>
  )
}

export default NewRequest
