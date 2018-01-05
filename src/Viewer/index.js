/* global fetchWithAuth */

import Component from "inferno-component";

import dataUIComponent from "../dataUIComponent";
import { capitalize } from "../utilities";
import { StringField } from "./Fields";

const FieldMapping = {
  string: StringField
};

const Field = ({
  field: { type, name, label, description, data, server },
  value,
  onChange
}) => {
  const Inp = FieldMapping[type || "string"];
  const lab = label || capitalize(name);

  if (server) return null;

  return (
    <div>
      <label>
        <h3 style={{ marginBottom: 0 }}>{lab}</h3>
      </label>
      {description && <span>{description}</span>}
      <Inp name={name} data={data} value={value} onChange={onChange} />
    </div>
  );
};

class Viewer extends Component {
  state = {
    entry: {}
  };
  onChange = (fieldname, value) => {
    const { entry } = this.state;
    entry[fieldname] = value;
    this.setState({ entry });
  };
  onSubmit = async e => {
    e.preventDefault();
    const { formslug } = this.props.params;
    const { entry } = this.state;
    var res = await fetchWithAuth(`/forms/${formslug}/response`, {
      method: "POST",
      body: { response: JSON.stringify(entry) }
    });
    var body = await res.json();
    if (res.ok) window.browserHistory.push("/");
    else this.setState({ error: body.error });
  };
  render() {
    const { fields } = this.props.data;
    const { entry } = this.state;

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <fieldset>
            {fields.map((field, index) => (
              <Field
                key={field.name}
                value={entry[field.name]}
                onChange={value => this.onChange(field.name, value)}
                field={field}
              />
            ))}
          </fieldset>
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

export default dataUIComponent(
  Viewer,
  props => props.data.title,
  props => `/forms/${props.params.formslug}`
);
