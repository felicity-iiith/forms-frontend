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
  error,
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
      {error && <span className="error">{error}</span>}
      <Inp name={name} data={data} value={value} onChange={onChange} />
    </div>
  );
};

class Viewer extends Component {
  state = {
    entry: {},
    filled: false,
    errors: {}
  };

  componentWillMount = () => {
    let response = null;
    const { entry } = this.state;
    if (this.props.data.response) {
      response = this.props.data.response.response;
      for (let key in response) {
        entry[key] = response[key];
      }
      this.setState({ filled: true });
    }
    for (let field of this.props.data.fields) {
      let value;
      if (field.userinfo_attr) value = window.user.info[field.userinfo_attr];
      else if (window.user.info[field.name])
        value = window.user.info[field.name];
      if (value) entry[field.name] = value;
    }
    this.setState({ entry });
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
    else this.setState({ errors: body.errors });
  };
  render() {
    const { fields } = this.props.data;
    const { entry, errors } = this.state;

    return (
      <div>
        {this.state.filled && (
          <h4 className="error">You have already filled this form</h4>
        )}
        <form onSubmit={this.onSubmit}>
          <fieldset>
            {fields.map((field, index) => (
              <Field
                key={field.name}
                value={entry[field.name]}
                error={errors[field.name]}
                onChange={value => this.onChange(field.name, value)}
                field={field}
              />
            ))}
          </fieldset>
          {!this.state.filled && <button>Submit</button>}
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
