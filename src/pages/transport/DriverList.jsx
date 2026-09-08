import { useFleet } from '../../hooks/useFleet'
import './FleetList.css'

function DriverList() {
  const { drivers } = useFleet()

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Drivers</h2>
          <p className="page-subtitle">
            Registered drivers available for assignment.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id}>
                  <td className="ref-cell">{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.phone}</td>
                  <td>
                    <span
                      className={`badge ${d.available ? 'badge-approved' : 'badge-rejected'}`}
                    >
                      {d.available ? 'Available' : 'Unavailable'}
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

export default DriverList