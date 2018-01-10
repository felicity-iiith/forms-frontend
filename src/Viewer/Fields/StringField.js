export default ({ value, onChange, readOnly }) => (
  <input
    type="text"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder="Your answer"
    readOnly={readOnly}
  />
);
