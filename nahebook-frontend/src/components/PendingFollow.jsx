import { Link } from "react-router-dom";

export default function PendingFollow({ props }) {
  return (
    <div className="pendingFollow">
      <h3>Pending follow requests</h3>
      {props.user.pendingFollow.length === 0 ? (
        <p>No pending follow requests</p>
      ) : (
        <ul data-testid="pendingFollow">
          {props.user.pendingFollow.map((item) => {
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
