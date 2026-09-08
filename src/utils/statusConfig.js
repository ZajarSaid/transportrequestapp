export const REQUEST_STATUSES = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  PENDING_LEADER: 'Pending Leader Recommendation',
  LEADER_APPROVED: 'Leader Approved',
  LEADER_REJECTED: 'Leader Rejected',
  PENDING_FUNDS: 'Pending Funds Confirmation',
  FUNDS_CONFIRMED: 'Funds Confirmed',
  FUNDS_NOT_AVAILABLE: 'Funds Not Available',
  PENDING_TRANSPORT: 'Pending Transport Review',
  VEHICLE_ALLOCATED: 'Vehicle Allocated',
  TRANSPORT_APPROVED: 'Transport Approved',
  REJECTED: 'Rejected',
  READY_FOR_TRIP: 'Ready for Trip',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export const WORKFLOW_STEPS = [
  { key: 'submitted', label: 'Request Submitted' },
  { key: 'leader', label: 'Leader Recommendation' },
  { key: 'accountant', label: 'Accountant Confirmation' },
  { key: 'transport', label: 'Transport Allocation' },
  { key: 'approval', label: 'Transport Approval' },
  { key: 'ready', label: 'Ready for Trip' },
]

export const REJECTION_STATUSES = [
  REQUEST_STATUSES.LEADER_REJECTED,
  REQUEST_STATUSES.REJECTED,
]

export const TERMINAL_STATUSES = [
  REQUEST_STATUSES.LEADER_REJECTED,
  REQUEST_STATUSES.REJECTED,
  REQUEST_STATUSES.CANCELLED,
  REQUEST_STATUSES.COMPLETED,
]

export const TRANSIT_STATUSES = [
  REQUEST_STATUSES.SUBMITTED,
  REQUEST_STATUSES.PENDING_LEADER,
  REQUEST_STATUSES.LEADER_APPROVED,
  REQUEST_STATUSES.PENDING_FUNDS,
  REQUEST_STATUSES.FUNDS_CONFIRMED,
  REQUEST_STATUSES.PENDING_TRANSPORT,
  REQUEST_STATUSES.VEHICLE_ALLOCATED,
  REQUEST_STATUSES.TRANSPORT_APPROVED,
  REQUEST_STATUSES.READY_FOR_TRIP,
]

export const ALL_STATUSES = Object.values(REQUEST_STATUSES)

export function statusBadgeVariant(status = '') {
  const s = String(status).toLowerCase()
  if (
    s.includes('draft') ||
    s.includes('pending') ||
    s.includes('submitted')
  ) {
    return 'pending'
  }
  if (
    s.includes('approve') ||
    s.includes('confirm') ||
    s.includes('allocat') ||
    s.includes('ready')
  ) {
    return 'approved'
  }
  if (s.includes('reject') || s.includes('cancel') || s.includes('not avail')) {
    return 'rejected'
  }
  if (s.includes('complete')) return 'completed'
  return 'pending'
}

export function getWorkflowProgress(status) {
  const completedSteps = []
  const currentKey = currentWorkflowStep(status)
  const statusIndex = WORKFLOW_STEPS.findIndex((s) => s.key === currentKey)
  if (currentKey && statusIndex !== -1) {
    WORKFLOW_STEPS.slice(0, statusIndex + 1).forEach((s) =>
      completedSteps.push(s.key),
    )
  }
  return { currentKey, statusIndex, completedSteps }
}

export function currentWorkflowStep(status) {
  switch (status) {
    case REQUEST_STATUSES.SUBMITTED:
      return 'submitted'
    case REQUEST_STATUSES.PENDING_LEADER:
    case REQUEST_STATUSES.LEADER_APPROVED:
      return 'leader'
    case REQUEST_STATUSES.PENDING_FUNDS:
    case REQUEST_STATUSES.FUNDS_CONFIRMED:
      return 'accountant'
    case REQUEST_STATUSES.PENDING_TRANSPORT:
    case REQUEST_STATUSES.VEHICLE_ALLOCATED:
      return 'transport'
    case REQUEST_STATUSES.TRANSPORT_APPROVED:
      return 'approval'
    case REQUEST_STATUSES.READY_FOR_TRIP:
    case REQUEST_STATUSES.COMPLETED:
      return 'ready'
    default:
      return null
  }
}