import { REQUEST_STATUSES } from './statusConfig'

const PENDING_STATUSES = [
  REQUEST_STATUSES.DRAFT,
  REQUEST_STATUSES.SUBMITTED,
  REQUEST_STATUSES.PENDING_LEADER,
  REQUEST_STATUSES.LEADER_APPROVED,
  REQUEST_STATUSES.PENDING_FUNDS,
  REQUEST_STATUSES.FUNDS_CONFIRMED,
  REQUEST_STATUSES.PENDING_TRANSPORT,
  REQUEST_STATUSES.VEHICLE_ALLOCATED,
]

const REJECTED_STATUSES = [
  REQUEST_STATUSES.LEADER_REJECTED,
  REQUEST_STATUSES.FUNDS_NOT_AVAILABLE,
  REQUEST_STATUSES.REJECTED,
  REQUEST_STATUSES.CANCELLED,
]

export function computeDashboardStats(requests) {
  const total = requests.length
  const pending = requests.filter((r) => PENDING_STATUSES.includes(r.status))
    .length
  const approved = requests.filter(
    (r) =>
      r.status === REQUEST_STATUSES.READY_FOR_TRIP ||
      r.status === REQUEST_STATUSES.TRANSPORT_APPROVED,
  ).length
  const rejected = requests.filter((r) =>
    REJECTED_STATUSES.includes(r.status),
  ).length
  const completed = requests.filter(
    (r) => r.status === REQUEST_STATUSES.COMPLETED,
  ).length

  const today = new Date()
  const upcoming = requests.filter((r) => {
    if (
      r.status !== REQUEST_STATUSES.READY_FOR_TRIP &&
      r.status !== REQUEST_STATUSES.TRANSPORT_APPROVED &&
      r.status !== REQUEST_STATUSES.COMPLETED
    ) {
      return false
    }
    const date = new Date(r.trip?.travelDate)
    return !Number.isNaN(date.getTime()) && date >= today
  }).length

  return { total, pending, approved, rejected, upcoming, completed }
}