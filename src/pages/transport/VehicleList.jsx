import { useFleet } from '../../hooks/useFleet'
import './FleetList.css'

function VehicleList() {
  const { vehicles } = useFleet()

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Vehicles</h2>
          <p className="page-subtitle">
            Fleet of vehicles available for transport allocation.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Registration</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td className="ref-cell">{v.id}</td>
                  <td>{v.registration}</td>
                  <td>{v.type}</td>
                  <td>{v.capacity} seats</td>
                  <td>
                    <span
                      className={`badge ${v.available ? 'badge-approved' : 'badge-rejected'}`}
                    >
                      {v.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VehicleList