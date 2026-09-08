import { Link, useParams } from 'react-router-dom'
import * as requestService from '../../services/requestService'
import { branches, projects } from '../../data/referenceData'
import {
  transportRates,
  transportInstructions,
} from '../../data/fleetData'
import { formatDate } from '../../utils/formatters'
import './PrintRequest.css'

function PrintRequest() {
  const { id } = useParams()
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

  return (
    <div className="print-page">
      <div className="print-toolbar no-print">
        <div>
          <h2 className="page-title">Official Transport Request Form</h2>
        </div>
        <div className="print-actions">
          <Link to={`/requests/${id}`} className="btn btn-secondary">
            Back
          </Link>
          <button className="btn btn-primary" onClick={() => window.print()}>
            🖨 Print
          </button>
        </div>
      </div>

      <div className="print-form" id="print-form">
        <TFormHeader request={request} />
        <TFormSection title="1. Request Information">
          <InfoRow label="Reference Number" value={request.referenceNumber} />
          <InfoRow label="Request Date" value={formatDate(request.createdAt)} />
          <InfoRow label="Status" value={request.status} />
          <InfoRow label="Applicant Declaration Date" value={request.applicantDeclaration?.date} />
        </TFormSection>
        <TFormSection title="2. Applicant Information">
          <InfoGrid items={[
            ['Name', request.applicant?.name],
            ['Branch / Station', branchName(request.applicant?.branch)],
            ['Phone', request.applicant?.phone],
            ['Email', request.applicant?.email],
            ['Project / Core Unit', projectName(request.applicant?.projectUnit)],
            ['Cost Center', request.applicant?.costCenter],
          ]} />
        </TFormSection>
        <TFormSection title="3. Trip Information">
          <InfoGrid items={[
            ['Travel Date', request.trip?.travelDate],
            ['Departure Time', request.trip?.departureTime],
            ['Number of Passengers', String(request.trip?.passengerCount)],
            ['Estimated Duration', request.trip?.estimatedDuration],
            ['Trip Origin', request.trip?.origin],
            ['Destination', request.trip?.destination],
          ]} />
          <InfoRow label="Reason for Trip" value={request.trip?.reason} block />
        </TFormSection>
        <TFormSection title="4. Passenger List">
          <ul className="print-passengers">
            {request.passengers?.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </TFormSection>
        <TFormSection title="5. Applicant Declaration">
          <InfoGrid items={[
            ['Applicant Name', request.applicantDeclaration?.applicantName],
            ['Date', request.applicantDeclaration?.date],
            ['Signature', request.applicantDeclaration?.signature],
            ['Confirmed', request.applicantDeclaration?.confirmed ? 'Yes' : 'No'],
          ]} />
        </TFormSection>
        <TFormSection title="6. Leader Recommendation">
          <ApprovalBlock data={request.leaderApproval} empty="Pending recommendation." />
        </TFormSection>
        <TFormSection title="7. Accountant Funds Confirmation">
          <ApprovalBlock data={request.fundsConfirmation} empty="Pending confirmation." />
        </TFormSection>
        <TFormSection title="8. Transport / Admin Section">
          <InfoGrid items={[
            ['Eligible for Allocation', isAllocatable(request.status) ? 'Yes' : 'No'],
            ['Vehicle Allocated', request.transportAllocation ? 'Yes' : 'No'],
            ['Current Status', request.status],
          ]} />
        </TFormSection>
        <TFormSection title="9. Vehicle & Driver Allocation">
          {request.transportAllocation ? (
            <>
              <InfoGrid items={[
                ['Vehicle', request.transportAllocation.vehicleName],
                ['Driver', request.transportAllocation.driverName],
                ['Allocated On', formatDate(request.transportAllocation.date)],
                ['', ''],
              ]} />
              <InfoRow label="Instructions" value={request.transportAllocation.instructions} block />
            </>
          ) : (
            <p className="print-empty">Not yet allocated.</p>
          )}
        </TFormSection>
        <TFormSection title="10. Transport Approval">
          <ApprovalBlock data={request.transportApproval} empty="Pending transport approval." />
        </TFormSection>
        <TFormSection title="11. Security Gate Section">
          {request.securityCheck ? (
            <InfoGrid items={[
              ['Checked By', request.securityCheck.checkedBy],
              ['Date / Time', request.securityCheck.date],
              ['Gate Status', request.securityCheck.gateStatus],
              ['Comment', request.securityCheck.comment],
            ]} />
          ) : (
            <p className="print-empty">No security check recorded.</p>
          )}
        </TFormSection>
        <TFormSection title="12. Additional Instructions & Rates">
          <h4 className="print-subhead">Transport Rates</h4>
          <ul className="print-rates">
            {transportRates.map((r) => (
              <li key={r.vehicle}>
                {r.vehicle}: {r.rate}
              </li>
            ))}
          </ul>
          <h4 className="print-subhead">Operational Instructions</h4>
          <ul className="print-rates">
            {transportInstructions.map((inst) => (
              <li key={inst}>{inst}</li>
            ))}
          </ul>
        </TFormSection>
      </div>
    </div>
  )
}

function TFormHeader({ request }) {
  return (
    <div className="print-header">
      <h1 className="print-title">TRANSPORT REQUEST FORM</h1>
      <p className="print-org">Hospital / Organization Transport Services</p>
      <div className="print-ref">
        <span className="print-ref-label">Reference</span>
        <span className="print-ref-value">{request.referenceNumber}</span>
      </div>
    </div>
  )
}

function TFormSection({ title, children }) {
  return (
    <section className="print-section">
      <h3 className="print-section-title">{title}</h3>
      <div className="print-section-body">{children}</div>
    </section>
  )
}

function InfoRow({ label, value, block = false }) {
  if (block) {
    return (
      <div className="print-row block">
        <span className="print-label">{label}</span>
        <span className="print-value">{value || '—'}</span>
      </div>
    )
  }
  return (
    <div className="print-row">
      <span className="print-label">{label}</span>
      <span className="print-value">{value || '—'}</span>
    </div>
  )
}

function InfoGrid({ items }) {
  return (
    <div className="print-grid">
      {items.map(([label, value], index) => (
        <div className="print-grid-item" key={index}>
          <span className="print-label">{label}</span>
          <span className="print-value">{value || '—'}</span>
        </div>
      ))}
    </div>
  )
}

function ApprovalBlock({ data, empty }) {
  if (!data) return <p className="print-empty">{empty}</p>
  const decision = data.approved === true
    ? 'Approved'
    : data.approved === false
      ? 'Rejected'
      : data.approved !== undefined
        ? data.approved
          ? 'Confirmed'
          : 'Unavailable'
        : '—'
  return (
    <InfoGrid items={[
      ['Decision', decision],
      ['Name', data.name],
      ['Date', formatDate(data.date)],
      ['Comment', data.comment || '—'],
    ]} />
  )
}

function branchName(id) {
  return branches.find((b) => b.id === id)?.name || '—'
}

function projectName(id) {
  return projects.find((p) => p.id === id)?.name || '—'
}

function isAllocatable(status) {
  return ['Pending Transport Review', 'Vehicle Allocated', 'Ready for Trip'].includes(status)
}

export default PrintRequest