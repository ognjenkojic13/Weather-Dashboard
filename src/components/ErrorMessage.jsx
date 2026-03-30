export default function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="error-message" role="alert">
      <span className="error-icon"></span>
      <p className="error-text">{message}</p>
      {onDismiss && (
        <button className="error-dismiss" onClick={onDismiss} aria-label="Dismiss error">
          &times;
        </button>
      )}
    </div>
  )
}
