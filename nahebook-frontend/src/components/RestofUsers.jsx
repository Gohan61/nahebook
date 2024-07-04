import { Link } from "react-router-dom";

export default function RestOfUsers({ props }) {
  const handleSubmit = (event, followId) => {
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
        <ul>
          {props.users.map((item) => {
            return (
              <li key={item.username}>
                <Link to={"/userprofiles"} state={{ userId: item._id }}>
                  {item.username}:
                </Link>
                <span className="firstName"> {item.first_name} </span>
                <span className="lastName">{item.last_name} </span>
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
