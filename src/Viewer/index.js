/* global fetchWithAuth */

import Component from "inferno-component";

import dataUIComponent from "../dataUIComponent";
import { capitalize } from "../utilities";
import { StringField, SelectField } from "./Fields";

const FieldMapping = {
  string: StringField,
  select: SelectField
};

const Field = ({
  field: { type, name, label, description, data, server, optional },
  value,
  readOnly,
  error,
  onChange
}) => {
  const Inp = FieldMapping[type || "string"];
  const lab = label || capitalize(name);

  if (server) return null;
  return (
    <div>
      <label>
        <h3 style={{ display: "inline-block", marginBottom: 0 }}>{lab}</h3>
        {optional && (
          <span style={{ fontWeight: "normal", fontSize: "1.4rem" }}>
            &nbsp;&nbsp;&nbsp;(Optional)
          </span>
        )}
      </label>
      {description && <span>{description}</span>}
      {error && <span className="error">{error}</span>}
      <Inp
        name={name}
        data={data}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
};

class Viewer extends Component {
  state = {
    entry: {},
    filled: false,
    paid: false,
    errors: {}
  };

  componentWillMount = () => {
    let response = null;
    const { entry } = this.state;
    for (let field of this.props.data.fields) {
      let value;
      if (field.userinfo_attr) value = window.user.info[field.userinfo_attr];
      else if (window.user.info[field.name])
        value = window.user.info[field.name];
      if (value) entry[field.name] = value;
    }
    if (this.props.data.response) {
      response = this.props.data.response.response;
      response = typeof response === "string" ? JSON.parse(response) : response;
      for (let key in response) {
        entry[key] = response[key];
      }
      this.setState({
        filled: true,
        paid: this.props.data.response.payment_status
      });
    }
    this.setState({ entry });
  };

  onChange = (fieldname, value) => {
    const { entry } = this.state;
    entry[fieldname] = value;
    this.setState({ entry });
  };
  redirectToPayment = () => {
    const { formslug } = this.props.params;
    window.location.assign(
      `${process.env.INFERNO_APP_BACKEND_URL}/forms/${formslug}/initiatePayment`
    );
  };
  onSubmit = async e => {
    e.preventDefault();
    const { formslug } = this.props.params;
    const { payment } = this.props.data;
    const { entry, filled } = this.state;
    if (filled && payment) {
      this.redirectToPayment();
      return;
    }
    var res = await fetchWithAuth(`/forms/${formslug}/response`, {
      method: "POST",
      body: { response: JSON.stringify(entry) }
    });
    var body = await res.json();
    if (res.ok) {
      if (payment) this.redirectToPayment();
      else this.setState({ filled: true, errors: {} });
    } else this.setState({ errors: body.errors });
  };
  render() {
    const { formslug, next } = this.props.params;
    const { fields, payment, seats_left, isAdmin } = this.props.data;
    const { entry, errors, paid, filled } = this.state;

    // Successfully registered and payment done
    const registered = filled && (!payment || paid);

    return (
      <div>
        <div className="clearfix">
          {isAdmin && (
            <a
              className="button float-right"
              style={{ marginLeft: 10 }}
              href={`${process.env.PUBLIC_URL}/${formslug}/responses`}
            >
              View Responses
            </a>
          )}
          {registered && (
            <h4 className="success float-left">
              You have successfully registered.
            </h4>
          )}
          {filled &&
            !registered && (
              <h4 className="error float-left">
                Your payment was unsuccessful. Please try to pay again.
              </h4>
            )}
          {errors._meta && <h4 className="error float-left">{errors._meta}</h4>}
          {!registered &&
            seats_left && (
              <h4 className="info float-left">
                Hurry, only {seats_left} seats left!
              </h4>
            )}
          {!registered &&
            seats_left === 0 && (
              <h4 className="error float-left">Sorry, all seats sold out.</h4>
            )}
          <a className="button float-right" href={next || "/"}>
            Go Back
          </a>
        </div>
        <form onSubmit={this.onSubmit}>
          <fieldset>
            {fields.map((field, index) => (
              <Field
                key={field.name}
                value={entry[field.name]}
                error={errors[field.name]}
                onChange={value => this.onChange(field.name, value)}
                field={field}
                readOnly={filled}
              />
            ))}
          </fieldset>
          {!filled && !payment && <button>Submit</button>}
          {payment &&
            !paid && <button>Proceed to pay &#8377; {payment.amount}</button>}
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
