/* global fetchWithAuth */

import Component from "inferno-component";

import dataUIComponent from "../dataUIComponent";

import arrayToCsv from "./arrayToCsv";

class ResViewer extends Component {
  state = {
    form: undefined,
    entries: [],
    loading: true,
    error: ""
  };
  async componentWillMount() {
    const { formslug } = this.props.params;
    if (this.props.data.length > 0) this.setState({ entries: this.props.data });
    else this.setState({ error: "No entries yet", loading: false });
    // Fetch form
    var res = await fetchWithAuth(`/forms/${formslug}`);
    res = await res.json();
    if (!res.error) this.setState({ form: res, loading: false });
    else this.setState({ error: res.error, loading: false });
  }
  getArray = () => {
    let table = [],
      row = [];
    const { form, entries } = this.state;
    if (!form) return [];
    row = [...form.fields.map(field => field.name)];
    table.push(row);
    entries.map(entry => {
      row = [];
      Object.keys(entry.response).forEach(key => row.push(entry.response[key]));
      table.push(row);
    });
    return table;
  };
  render() {
    const { form, loading, error } = this.state;

    const array = this.getArray();
    const download_url =
      "data:text/csv;charset=utf-8," + encodeURIComponent(arrayToCsv(array));
    const filename = form && form.name ? form.name + ".csv" : "eforms.csv";

    return (
      <div>
        {loading && <div>Loading...</div>}
        {error && <div className="error">ERROR: {error}</div>}
        <h1>
          {form && form.name}
          <a
            className="button float-right"
            href={download_url}
            download={filename}
          >
            Export To CSV
          </a>
        </h1>
        <table>
          <thead>
            <tr>{array[0] && array[0].map(f => <th>{f}</th>)}</tr>
          </thead>
          <tbody>
            {array
              .slice(1)
              .map((entry, key) => (
                <tr key={key}>{entry.map(f => <td>{f}</td>)}</tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default dataUIComponent(
  ResViewer,
  props => props.data.title,
  props => `/forms/${props.params.formslug}/responses`
);
