import { Link, useParams } from 'react-router-dom'
import * as requestService from '../../services/requestService'
import { branches, projects } from '../../data/referenceData'
import DetailSection, { DetailGrid, DetailItem } from '../../components/DetailSection'
import StatusBadge from '../../components/StatusBadge'
import './RequestDetail.css'

function RequestDetail() {
  const { id } = useParams()
  const request = requestService.getRequestById(id)

  if (!request) {
    return (
      <div className="page">
        <div className="not-found card">
          <h2 className="page-title">Request Not Found</h2>
          <p>The request you are looking for does not exist or has been removed.</p>
          <Link to="/requests" className="btn btn-secondary">Back to My Requests</Link>
        </div>
      </div>
    )
  }

  const branch = branches.find((b) => b.id === request.applicant?.branch)
  const project = projects.find((p) => p.id === request.applicant?.projectUnit)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">{request.referenceNumber}</h2>
          <div className="subtitle-line">
            <StatusBadge status={request.status} />
          </div>
        </div>
        <div className="header-actions">
          <Link to="/requests" className="btn btn-secondary">Back</Link>
          <Link to={`/requests/${id}/status`} className="btn btn-secondary">View Status</Link>
          <Link to={`/requests/${id}/print`} className="btn btn-secondary">Print</Link>
        </div>
      </div>

      <div className="section-stack">
        <DetailSection title="Applicant Information" subtitle="Who requested this transport">
          <DetailGrid>
            <DetailItem label="Name" value={request.applicant?.name} />
            <DetailItem label="Branch / Station" value={branch?.name} />
            <DetailItem label="Phone" value={request.applicant?.phone} />
            <DetailItem label="Email" value={request.applicant?.email} />
            <DetailItem label="Project / Core Unit" value={project?.name} />
            <DetailItem label="Cost Center" value={request.applicant?.costCenter} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Trip Information" subtitle="Journey details">
          <DetailGrid>
            <DetailItem label="Travel Date" value={request.trip?.travelDate} />
            <DetailItem label="Departure Time" value={request.trip?.departureTime} />
            <DetailItem label="Passengers" value={request.trip?.passengerCount} />
            <DetailItem label="Estimated Duration" value={request.trip?.estimatedDuration} />
            <DetailItem label="Origin" value={request.trip?.origin} />
            <DetailItem label="Destination" value={request.trip?.destination} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Passengers" subtitle={`${request.passengers?.length || 0} passengers`}>
          <ul className="passenger-list-static">
            {request.passengers?.length ? (
              request.passengers.map((p) => (
                <li key={p}>{p}</li>
              ))
            ) : (
              <li className="muted">No passengers listed</li>
            )}
          </ul>
        </DetailSection>

        <DetailSection title="Reason for Trip" subtitle="Why is this trip needed?">
          <p className="reason-text">{request.trip?.reason || '—'}</p>
        </DetailSection>

        <DetailSection title="Applicant Declaration" subtitle="Applicant confirmation">
          <DetailGrid>
            <DetailItem label="Declared By" value={request.applicantDeclaration?.applicantName} />
            <DetailItem label="Date" value={request.applicantDeclaration?.date} />
            <DetailItem label="Signature" value={request.applicantDeclaration?.signature} />
            <DetailItem label="Confirmed" value={request.applicantDeclaration?.confirmed ? 'Yes' : 'No'} />
          </DetailGrid>
        </DetailSection>

        <ApprovalHistory request={request} />
        <VehicleAndDriver request={request} />
        <SecurityInfo request={request} />
        <ActivityHistory request={request} />
      </div>
    </div>
  )
}

function ApprovalHistory({ request }) {
  const entries = [
    {
      title: 'Leader Recommendation',
      data: request.leaderApproval,
      empty: 'Not yet recommended',
    },
    {
      title: 'Funds Confirmation',
      data: request.fundsConfirmation,
      empty: 'Not yet confirmed',
    },
    {
      title: 'Transport Approval',
      data: request.transportApproval,
      empty: 'Not yet approved',
    },
  ]

  return (
    <DetailSection title="Approval History" subtitle="Chain of approvals">
      {entries.map(({ title, data, empty }) => (
        <div className="approval-block" key={title}>
          <h4 className="approval-title">{title}</h4>
          {data ? (
            <DetailGrid>
              <DetailItem label="Decision" value={formatDecision(data)} />
              <DetailItem label="Approved By" value={data.name} />
              <DetailItem label="Date" value={formatDate(data.date)} />
              <DetailItem label="Comment" value={data.comment} />
            </DetailGrid>
          ) : (
            <p className="approval-empty">{empty}</p>
          )}
        </div>
      ))}
    </DetailSection>
  )
}

function VehicleAndDriver({ request }) {
  const allocation = request.transportAllocation
  return (
    <DetailSection title="Vehicle Allocation" subtitle="Assigned vehicle and driver">
      {allocation?.vehicleId || allocation?.driverId ? (
        <DetailGrid>
          <DetailItem label="Vehicle" value={allocation.vehicleName || allocation.vehicleId || '—'} />
          <DetailItem label="Driver" value={allocation.driverName || allocation.driverId || '—'} />
          <DetailItem label="Instructions" value={allocation.instructions} multiline />
        </DetailGrid>
      ) : (
        <p className="approval-empty">Vehicle not yet allocated.</p>
      )}
    </DetailSection>
  )
}

function SecurityInfo({ request }) {
  const check = request.securityCheck
  return (
    <DetailSection title="Security Information" subtitle="Gate verification">
      {check ? (
        <DetailGrid>
          <DetailItem label="Checked By" value={check.checkedBy} />
          <DetailItem label="Date / Time" value={formatDate(check.date)} />
          <DetailItem label="Gate Status" value={check.gateStatus} />
          <DetailItem label="Comment" value={check.comment} />
        </DetailGrid>
      ) : (
        <p className="approval-empty">No security check recorded yet.</p>
      )}
    </DetailSection>
  )
}

function ActivityHistory({ request }) {
  const activities = [
    { label: 'Request Created', value: formatDate(request.createdAt) },
    { label: 'Submitted', value: '—' },
    { label: 'Last Updated', value: formatDate(request.updatedAt) },
    { label: 'Current Status', value: request.status },
  ]

  return (
    <DetailSection title="Activity History" subtitle="Key activity timestamps">
      <DetailGrid>
        {activities.map((a) => (
          <DetailItem key={a.label} label={a.label} value={a.value} />
        ))}
      </DetailGrid>
    </DetailSection>
  )
}

function formatDecision(data) {
  if (data.approved === true) return 'Approved'
  if (data.approved === false) return 'Rejected'
  return data.decision || '—'
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export default RequestDetail