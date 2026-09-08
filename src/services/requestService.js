import {
  loadRequests,
  saveRequests,
  clearRequests,
  hasEmptyMarker,
} from '../utils/storage'
import { seedRequests } from '../data/seedRequests'

export function getRequests() {
  let requests = loadRequests()
  if (requests.length === 0 && !hasEmptyMarker()) {
    saveRequests(seedRequests)
    requests = seedRequests
  }
  return requests
}

export function getRequestById(id) {
  return getRequests().find((req) => req.id === id) || null
}

export function getRequestByReference(referenceNumber) {
  return (
    getRequests().find((req) => req.referenceNumber === referenceNumber) || null
  )
}

export function createRequest(requestData) {
  const requests = getRequests()
  const newRequest = {
    ...requestData,
    id: requestData.id || generateId(),
  }
  requests.push(newRequest)
  saveRequests(requests)
  return newRequest
}

export function updateRequest(id, updates) {
  const requests = getRequests()
  const index = requests.findIndex((req) => req.id === id)
  if (index === -1) return null
  const updated = {
    ...requests[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  requests[index] = updated
  saveRequests(requests)
  return updated
}

export function updateRequestStatus(id, status) {
  const updated = updateRequest(id, { status })
  return updated
}

export function submitRequest(id) {
  const request = getRequestById(id)
  if (!request) return null
  if (request.status !== 'Draft') {
    throw new Error('Only draft requests can be submitted.')
  }
  const updated = updateRequest(id, {
    status: 'Submitted',
    submittedAt: new Date().toISOString(),
  })
  return updated
}

export function setLeaderApproval(id, approval) {
  const updated = updateRequest(id, {
    leaderApproval: approval,
    status: approval.approved
      ? 'Pending Funds Confirmation'
      : 'Leader Rejected',
  })
  return updated
}

export function setFundsConfirmation(id, confirmation) {
  const updated = updateRequest(id, {
    fundsConfirmation: confirmation,
    status: confirmation.fundsAvailable
      ? 'Pending Transport Review'
      : 'Funds Not Available',
  })
  return updated
}

export function allocateTransport(id, allocation) {
  const request = getRequestById(id)
  if (!request) return null
  if (!allocation.vehicleId || !allocation.driverId) {
    throw new Error('Vehicle and driver are required for allocation.')
  }
  const updated = updateRequest(id, {
    transportAllocation: allocation,
    status: 'Vehicle Allocated',
  })
  return updated
}

export function approveTransport(id, approval) {
  const request = getRequestById(id)
  if (!request) return null
  if (!request.transportAllocation) {
    throw new Error('Vehicle must be allocated before transport approval.')
  }
  const updated = updateRequest(id, {
    transportApproval: approval,
    status: approval.approved ? 'Ready for Trip' : 'Rejected',
  })
  return updated
}

export function recordSecurityCheck(id, check) {
  const request = getRequestById(id)
  if (!request) return null
  if (request.status !== 'Ready for Trip') {
    throw new Error('Security verification requires transport approval.')
  }
  const updated = updateRequest(id, {
    securityCheck: check,
    status: check.gateStatus === 'Cleared' ? 'Completed' : 'Ready for Trip',
  })
  return updated
}

export function deleteRequest(id) {
  const requests = getRequests().filter((req) => req.id !== id)
  saveRequests(requests)
  return true
}

export function resetRequests() {
  clearRequests()
  saveRequests([])
  return []
}

function generateId() {
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
