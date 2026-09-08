import { vehicles as seedVehicles, drivers as seedDrivers } from '../data/fleetData'

const VEHICLES_KEY = 'trs_vehicles'
const DRIVERS_KEY = 'trs_drivers'

function loadCollection(key, seed) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return seed
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seed
  } catch (error) {
    console.error(`Failed to load ${key} from storage:`, error)
    return seed
  }
}

function saveCollection(key, collection) {
  try {
    localStorage.setItem(key, JSON.stringify(collection))
    return true
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error)
    return false
  }
}

export function getVehicles() {
  return loadCollection(VEHICLES_KEY, seedVehicles)
}

export function getVehicleById(id) {
  return getVehicles().find((v) => v.id === id) || null
}

export function getAvailableVehicles() {
  return getVehicles().filter((v) => v.available)
}

export function updateVehicle(id, updates) {
  const collection = getVehicles()
  const index = collection.findIndex((v) => v.id === id)
  if (index === -1) return null
  const updated = { ...collection[index], ...updates }
  collection[index] = updated
  saveCollection(VEHICLES_KEY, collection)
  return updated
}

export function getDrivers() {
  return loadCollection(DRIVERS_KEY, seedDrivers)
}

export function getDriverById(id) {
  return getDrivers().find((d) => d.id === id) || null
}

export function getAvailableDrivers() {
  return getDrivers().filter((d) => d.available)
}

export function updateDriver(id, updates) {
  const collection = getDrivers()
  const index = collection.findIndex((d) => d.id === id)
  if (index === -1) return null
  const updated = { ...collection[index], ...updates }
  collection[index] = updated
  saveCollection(DRIVERS_KEY, collection)
  return updated
}