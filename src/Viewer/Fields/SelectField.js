import Component from "inferno-component";

class SelectField extends Component {
  state = {
    other: false
  };
  componentWillMount = () => {
    const { data, value } = this.props;
    if (data.other && value && data.options.indexOf(value) === -1)
      this.setState({ other: true });
  };
  onChange = e => {
    let { value } = e.target;
    const { onChange } = this.props;
    if (value === "Other") {
      this.setState({ other: true });
      value = "";
    } else {
      this.setState({ other: false });
    }
    onChange(value);
  };
  render({ data, value, onChange, readOnly }) {
    const { other } = this.state;
    return (
      <div>
        <select
          value={(other && "Other") || value || ""}
          onChange={this.onChange}
          readOnly={readOnly}
        >
          <option key={0} value="" />
          {data.options.map((option, key) => (
            <option key={key + 1} value={option}>
              {option}
            </option>
          ))}
          {data.other && (
            <option key={-1} value="Other">
              Other
            </option>
          )}
        </select>
        {other && (
          <input
            type="text"
            value={value}
            placeHolder="Please specify"
            onChange={e => onChange(e.target.value)}
            readOnly={readOnly}
          />
        )}
      </div>
    );
  }
}

export default SelectField;
