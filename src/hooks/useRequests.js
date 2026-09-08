import { useState, useCallback } from 'react'
import * as requestService from '../services/requestService'

export function useRequests() {
  const [state, setState] = useState(() => {
    try {
      return { requests: requestService.getRequests(), error: null }
    } catch (err) {
      return { requests: [], error: err.message || 'Failed to load requests' }
    }
  })

  const { requests, error } = state

  const refresh = useCallback(() => {
    try {
      setState({ requests: requestService.getRequests(), error: null })
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message || 'Failed to load requests' }))
    }
  }, [])

  const addRequest = useCallback((requestData) => {
    const created = requestService.createRequest(requestData)
    setState((prev) => ({ ...prev, requests: [...prev.requests, created] }))
    return created
  }, [])

  const updateRequest = useCallback((id, updates) => {
    const updated = requestService.updateRequest(id, updates)
    setState((prev) => ({
      ...prev,
      requests: prev.requests.map((req) => (req.id === id ? updated : req)),
    }))
    return updated
  }, [])

  const updateStatus = useCallback((id, status) => {
    const updated = requestService.updateRequestStatus(id, status)
    setState((prev) => ({
      ...prev,
      requests: prev.requests.map((req) => (req.id === id ? updated : req)),
    }))
    return updated
  }, [])

  const submitRequest = useCallback((id) => {
    const updated = requestService.submitRequest(id)
    setState((prev) => ({
      ...prev,
      requests: prev.requests.map((req) => (req.id === id ? updated : req)),
    }))
    return updated
  }, [])

  const setLeaderApproval = useCallback((id, approval) => {
    const updated = requestService.setLeaderApproval(id, approval)
    setState((prev) => ({
      ...prev,
      requests: prev.requests.map((req) => (req.id === id ? updated : req)),
    }))
    return updated
  }, [])

  const setFundsConfirmation = useCallback((id, confirmation) => {
    const updated = requestService.setFundsConfirmation(id, confirmation)
    setState((prev) => ({
      ...prev,
      requests: prev.requests.map((req) => (req.id === id ? updated : req)),
    }))
    return updated
  }, [])

  const allocateTransport = useCallback((id, allocation) => {
    const updated = requestService.allocateTransport(id, allocation)
    setState((prev) => ({
      ...prev,
      requests: prev.requests.map((req) => (req.id === id ? updated : req)),
    }))
    return updated
  }, [])

  const approveTransport = useCallback((id, approval) => {
    const updated = requestService.approveTransport(id, approval)
    setState((prev) => ({
      ...prev,
      requests: prev.requests.map((req) => (req.id === id ? updated : req)),
    }))
    return updated
  }, [])

  const recordSecurityCheck = useCallback((id, check) => {
    const updated = requestService.recordSecurityCheck(id, check)
    setState((prev) => ({
      ...prev,
      requests: prev.requests.map((req) => (req.id === id ? updated : req)),
    }))
    return updated
  }, [])

  const removeRequest = useCallback((id) => {
    requestService.deleteRequest(id)
    setState((prev) => ({
      ...prev,
      requests: prev.requests.filter((req) => req.id !== id),
    }))
  }, [])

  const resetRequests = useCallback(() => {
    const requests = requestService.resetRequests()
    setState({ requests, error: null })
    return requests
  }, [])

  return {
    requests,
    loading: false,
    error,
    refresh,
    addRequest,
    updateRequest,
    updateStatus,
    submitRequest,
    setLeaderApproval,
    setFundsConfirmation,
    allocateTransport,
    approveTransport,
    recordSecurityCheck,
    removeRequest,
    resetRequests,
  }
}
