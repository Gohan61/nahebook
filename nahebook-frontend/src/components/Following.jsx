import { Link } from "react-router-dom";

export default function Following({ props }) {
  return (
    <div className="following">
      <h3>Users you are following</h3>
      {props.user.following.length === 0 ? (
        <p>You aren&apos;t following any users</p>
      ) : (
        <ul>
          {props.user.following.map((item) => {
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
