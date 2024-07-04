import { Link } from "react-router-dom";

export default function ReceivedRequests({ props }) {
  return (
    <div className="receivedFollow">
      <h3>Received follow requests</h3>
      {props.user.receivedRequestFollow.length === 0 ? (
        <p>No received follow requests</p>
      ) : (
        <ul>
          {props.user.receivedRequestFollow.map((item) => {
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
