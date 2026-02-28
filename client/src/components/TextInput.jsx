export default function TextInput({
  id,
  label,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  spellCheck,
  required = false,
  error,
  assistiveText,
}) {
  const assistiveId = `${id}-assistive`;
  const errorId = `${id}-error`;

  const describedBy = [assistiveText ? assistiveId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        className="field-input"
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        spellCheck={spellCheck}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
      />

      {assistiveText ? (
        <p className="field-assistive" id={assistiveId}>
          {assistiveText}
        </p>
      ) : null}

      {error ? (
        <p className="field-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
