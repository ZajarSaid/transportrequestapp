import { useState, useCallback } from 'react'
import * as fleetService from '../services/fleetService'

export function useFleet() {
  const [state, setState] = useState(() => ({
    vehicles: fleetService.getVehicles(),
    drivers: fleetService.getDrivers(),
  }))

  const refresh = useCallback(() => {
    setState({
      vehicles: fleetService.getVehicles(),
      drivers: fleetService.getDrivers(),
    })
  }, [])

  return {
    ...state,
    refresh,
    getAvailableVehicles: () => fleetService.getAvailableVehicles(),
    getAvailableDrivers: () => fleetService.getAvailableDrivers(),
    getVehicleById: (id) => fleetService.getVehicleById(id),
    getDriverById: (id) => fleetService.getDriverById(id),
  }
}