import { Link } from "react-router-dom";
import he from "he";

export default function RestOfUsers({ props }) {
  const handleSubmit = (event, followId) => {
    event.preventDefault();

    fetch(
      `https://nahebook-backend.fly.dev/user/follow/${localStorage.getItem("userId")}`,
      {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Token"),
        },
        body: JSON.stringify({
          followUserId: followId,
        }),
      },
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "Follow request send") {
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
    <div className="restUsers">
      <h3>Rest of users</h3>
      {props.users.length === 0 ? (
        <p>No other users</p>
      ) : (
        <ul data-testid="restofusers">
          {props.users.map((item) => {
            return (
              <li key={item.username}>
                <Link to={"/userprofiles"} state={{ userId: item._id }}>
                  {he.decode(item.username)}:
                </Link>
                <span className="firstName">{he.decode(item.first_name)} </span>
                <span className="lastName">{he.decode(item.last_name)} </span>
                <button onClick={(e) => handleSubmit(e, item._id)}>
                  Follow
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
