export default ({ data, value, onChange, readOnly }) => (
  <select
    value={value || 0}
    onChange={e => onChange(parseInt(e.target.value, 10))}
    readOnly={readOnly}
  >
    <option key={0} value={0} />
    {data.options.map((option, key) => (
      <option key={key + 1} value={key + 1}>
        {option}
      </option>
    ))}
  </select>
);
