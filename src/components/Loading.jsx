export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring" />
        <span className="loading-icon"></span>
      </div>
      <p className="loading-text">Loading weather data...</p>
    </div>
  )
}
