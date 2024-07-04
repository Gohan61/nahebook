import { Link } from "react-router-dom";

export default function RestOfUsers({ props }) {
  return (
    <div className="restUsers">
      <h3>Rest of users</h3>
      {props.users.length === 0 ? (
        <p>No other users</p>
      ) : (
        <ul>
          {props.users.map((item) => {
            return (
              <li key={item.username}>
                <Link to={"/userprofiles"} state={{ userId: item._id }}>
                  {item.username}:
                </Link>
                <span className="firstName"> {item.first_name} </span>
                <span className="lastName">{item.last_name}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
