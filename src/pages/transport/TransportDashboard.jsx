import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRequests } from '../../hooks/useRequests'
import { useFleet } from '../../hooks/useFleet'
import RequestSummaryCard from '../../components/RequestSummaryCard'
import StatusBadge from '../../components/StatusBadge'
import {
  REQUEST_STATUSES,
} from '../../utils/statusConfig'
import {
  transportRates,
  transportInstructions,
} from '../../data/fleetData'
import './TransportDashboard.css'

function TransportDashboard() {
  const { requests, allocateTransport, approveTransport } = useRequests()
  const { vehicles, drivers } = useFleet()
  const [selectedId, setSelectedId] = useState(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const eligible = requests.filter((r) =>
    [
      REQUEST_STATUSES.PENDING_TRANSPORT,
      REQUEST_STATUSES.VEHICLE_ALLOCATED,
    ].includes(r.status),
  )

  const selected =
    eligible.find((r) => r.id === selectedId) || eligible[0] || null

  const handleAllocate = (allocation) => {
    if (!selected) return
    setError(null)
    setMessage(null)
    try {
      const updated = allocateTransport(selected.id, allocation)
      setMessage(
        `Request ${updated.referenceNumber}: vehicle and driver allocated.`,
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const handleApprove = (approved) => {
    if (!selected) return
    setError(null)
    setMessage(null)
    try {
      const updated = approveTransport(selected.id, {
        approved,
        name: 'Transport Officer',
        date: new Date().toISOString(),
        comment: '',
      })
      setMessage(
        `Request ${updated.referenceNumber}: transport ${
          approved ? 'approved — ready for trip.' : 'rejected.'
        }`,
      )
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Transport Dashboard</h2>
          <p className="page-subtitle">
            Allocate vehicles and drivers, then approve or reject transport.
          </p>
        </div>
      </div>

      {message && <div className="action-message success">{message}</div>}
      {error && <div className="action-message error">{error}</div>}

      <div className="transport-layout">
        <div className="transport-main">
          {eligible.length === 0 ? (
            <div className="empty-state card">
              <p>
                No requests are eligible for allocation. Requests appear here
                after funds are confirmed.
              </p>
            </div>
          ) : (
            <div className="transport-queue">
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
                  <div className="queue-line">
                    <span className="queue-label">Travel Date</span>
                    <span className="queue-value">{r.trip?.travelDate}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="transport-panel">
          {selected ? (
            <>
              <RequestSummaryCard request={selected} />
              {selected.status === REQUEST_STATUSES.VEHICLE_ALLOCATED ? (
                <AllocationSummary request={selected} />
              ) : (
                <AllocationForm
                  request={selected}
                  vehicles={vehicles}
                  drivers={drivers}
                  onSubmit={handleAllocate}
                />
              )}

              {selected.transportAllocation && (
                <div className="card approval-panel-inline">
                  <h3 className="action-panel-title">Transport Approval</h3>
                  <p className="approval-note">
                    Approve this request to make it ready for departure.
                  </p>
                  <div className="approval-buttons">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleApprove(true)}
                    >
                      Approve Transport
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleApprove(false)}
                    >
                      Reject Transport
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state card">
              <p>Select a request to manage allocation and approval.</p>
            </div>
          )}
        </div>
      </div>

      <div className="info-grid">
        <div className="card info-card">
          <h3 className="info-title">Transport Rates</h3>
          <ul className="info-list">
            {transportRates.map((r) => (
              <li key={r.vehicle}>
                <span className="info-label">{r.vehicle}</span>
                <span className="info-value">{r.rate}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card info-card">
          <h3 className="info-title">Operational Instructions</h3>
          <ol className="info-list info-ordered">
            {transportInstructions.map((inst) => (
              <li key={inst}>{inst}</li>
            ))}
          </ol>
        </div>
        <div className="card info-card">
          <h3 className="info-title">Quick Links</h3>
          <div className="quick-links">
            <Link to="/transport/vehicles" className="btn btn-secondary">
              View Vehicles
            </Link>
            <Link to="/transport/drivers" className="btn btn-secondary">
              View Drivers
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function AllocationForm({ request, vehicles, drivers, onSubmit }) {
  const [vehicleId, setVehicleId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [instructions, setInstructions] = useState('')

  const availableVehicles = vehicles.filter((v) => v.available)
  const availableDrivers = drivers.filter((d) => d.available)
  const passengerCount = request.trip?.passengerCount || 0

  const canSubmit = vehicleId && driverId

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    const vehicle = vehicles.find((v) => v.id === vehicleId)
    const driver = drivers.find((d) => d.id === driverId)
    onSubmit({
      vehicleId,
      driverId,
      vehicleName: `${vehicle.type} · ${vehicle.registration}`,
      driverName: driver.name,
      instructions: instructions.trim(),
      date: new Date().toISOString(),
    })
  }

  return (
    <div className="card allocation-form">
      <h3 className="action-panel-title">Allocate Vehicle &amp; Driver</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">
            Vehicle (must be available)
            <span className="form-required">*</span>
          </label>
          <select
            className="form-control"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
          >
            <option value="">Select vehicle...</option>
            {availableVehicles.map((v) => (
              <option key={v.id} value={v.id} disabled={v.capacity < passengerCount}>
                {v.type} · {v.registration} (capacity {v.capacity})
              </option>
            ))}
          </select>
          {availableVehicles.length === 0 && (
            <p className="form-hint">No vehicles are currently available.</p>
          )}
        </div>

        <div className="form-field">
          <label className="form-label">
            Driver (must be available)
            <span className="form-required">*</span>
          </label>
          <select
            className="form-control"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
          >
            <option value="">Select driver...</option>
            {availableDrivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} · {d.phone}
              </option>
            ))}
          </select>
          {availableDrivers.length === 0 && (
            <p className="form-hint">No drivers are currently available.</p>
          )}
        </div>

        <div className="form-field">
          <label className="form-label">Instructions</label>
          <textarea
            className="form-control"
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Special instructions for the driver..."
          />
        </div>

        {!canSubmit && (
          <p className="form-hint">
            Select both an available vehicle and a driver to allocate.
          </p>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!canSubmit}
          >
            Allocate Vehicle
          </button>
        </div>
      </form>
    </div>
  )
}

function AllocationSummary({ request }) {
  const allocation = request.transportAllocation || {}
  return (
    <div className="card allocation-summary">
      <h3 className="action-panel-title">Current Allocation</h3>
      <div className="finance-fields">
        <div className="finance-field">
          <span className="finance-label">Vehicle</span>
          <span className="finance-value">
            {allocation.vehicleName || allocation.vehicleId}
          </span>
        </div>
        <div className="finance-field">
          <span className="finance-label">Driver</span>
          <span className="finance-value">
            {allocation.driverName || allocation.driverId}
          </span>
        </div>
        <div className="finance-field">
          <span className="finance-label">Status</span>
          <span className="finance-value">
            <StatusBadge status={request.status} />
          </span>
        </div>
        <div className="finance-field">
          <span className="finance-label">Allocated On</span>
          <span className="finance-value">{formatDate(allocation.date)}</span>
        </div>
        {allocation.instructions && (
          <div className="finance-field finance-wide">
            <span className="finance-label">Instructions</span>
            <span className="finance-value">{allocation.instructions}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export default TransportDashboard