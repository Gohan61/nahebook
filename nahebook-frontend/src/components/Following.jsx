import { Link } from "react-router-dom";

export default function Following({ props }) {
  const handleSubmit = (event, unfollowId) => {
    event.preventDefault();

    fetch(
      `http://localhost:3000/user/unfollow/${localStorage.getItem("userId")}`,
      {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Token"),
        },
        body: JSON.stringify({
          unfollowId: unfollowId,
        }),
      },
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "Unfollow successful") {
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
                <button onClick={(e) => handleSubmit(e, item._id)}>
                  Unfollow
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
