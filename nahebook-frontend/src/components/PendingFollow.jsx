import { Link } from "react-router-dom";
import he from "he";

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
                  {he.decode(item.username)}:
                </Link>
                <span className="firstName">{he.decode(item.first_name)} </span>
                <span className="lastName">{he.decode(item.last_name)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
