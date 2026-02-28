export default function ActionButton({
  children,
  disabled,
  loading,
  type = "button",
  className = "",
  onClick,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`action-button ${className}`.trim()}
      onClick={onClick}
    >
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          <span>Shortening...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
