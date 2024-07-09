import { Link } from "react-router-dom";
import he from "he";

export default function ReceivedRequests({ props }) {
  const handleSubmit = (event, followId, answer) => {
    event.preventDefault();

    fetch(
      `http://localhost:3000/user/follow/${localStorage.getItem("userId")}`,
      {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Token"),
        },
        body: JSON.stringify({
          followUserId: followId,
          answer: answer,
        }),
      },
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (
          res.message === "Denied follow request" ||
          res.message === "Following succesful"
        ) {
          props.refresh ? props.setRefresh(false) : props.setRefresh(true);
        } else {
          throw res.error.message;
        }
      })
      .catch((err) => {
        props.setError(err);
      });
  };

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
                  {he.decode(item.username)}:
                </Link>
                <span className="firstName">{he.decode(item.first_name)} </span>
                <span className="lastName">{he.decode(item.last_name)} </span>
                <button onClick={(e) => handleSubmit(e, item._id, "accept")}>
                  Accept
                </button>
                <button onClick={(e) => handleSubmit(e, item._id, "deny")}>
                  Deny
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
