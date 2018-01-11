import Component from "inferno-component";
import { capitalize } from "../../utilities";

const TeamMemberData = ({ no, fields, value = {}, onChange, readOnly }) => (
  <div>
    <h4>Details of Team Member {no + 1}</h4>
    {fields.map(field => (
      <input
        type="text"
        placeholder={capitalize(field)}
        value={value[field]}
        readOnly={readOnly}
        key={field}
        onChange={e => onChange(field, e.target.value)}
      />
    ))}
  </div>
);

class TeamField extends Component {
  changeTeamSize = newsize => {
    let { value, onChange } = this.props;
    if (!value) value = {};
    value.team_size = newsize;
    if (!value.member_data) value.member_data = [];
    const to_push = newsize - value.member_data.length + 1;
    for (let i = 0; i < to_push; i++) value.member_data.push({});
    value.member_data = value.member_data.slice(0, value.team_size - 1);
    onChange(value);
  };
  changeMemberData = (no, field, nv) => {
    let { value, onChange } = this.props;
    if (!value) value = {};
    value.member_data[no][field] = nv;
    onChange(value);
  };
  render({ data, value = { member_data: {} }, readOnly }) {
    let team_options = [];
    for (let i = data.min; i <= data.max; i++) team_options.push(i);
    if (!value.team_size) this.changeTeamSize(data.min);
    const team_size = value.team_size || data.min;
    const member_data = value.member_data || {};
    let memberdatafields = [];
    for (let i = 0; i < team_size - 1; i++) {
      memberdatafields.push(
        <TeamMemberData
          fields={data.fields}
          key={i}
          no={i}
          value={member_data[i]}
          onChange={(field, nv) => this.changeMemberData(i, field, nv)}
          readOnly={readOnly}
        />
      );
    }
    return (
      <div>
        <select
          value={team_size}
          onChange={e => this.changeTeamSize(parseInt(e.target.value, 10))}
          readOnly={readOnly}
        >
          {team_options.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <div>{memberdatafields}</div>
      </div>
    );
  }
}

export default TeamField;
