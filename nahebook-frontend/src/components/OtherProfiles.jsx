import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Profile() {
  const location = useLocation();
  const userIdProp = location.state.userId;
  const [url, setUrl] = useState(
    `http://localhost:3000/user/profile/${userIdProp}`,
  );
  const [user, setUser] = useState("");
  const [error, setError] = useState(undefined);

  useEffect(() => {
    fetch(url, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.user) {
          setUser(res.user);
        } else {
          setError(res.error.message);
        }
      });
  }, [url]);

  return (
    <div className="profile">
      <h2>Your profile</h2>
      {!user ? (
        <p>Loading</p>
      ) : (
        <>
          <img src={user.profile_picture} alt="Avatar of your user profile" />
          <p className="first_name">
            <span>First name:</span> {user.first_name}
          </p>
          <p className="last_name">
            <span>Last name:</span> {user.last_name}
          </p>
          <p className="username">
            <span>Username:</span> {user.username}
          </p>
          <p className="age">
            <span>Age:</span> {user.age ? user.age : "Not specified"}
          </p>
          <p className="bio">
            <span>Bio:</span> {user.bio}
          </p>
          <div className="profilePosts">
            {user.posts.length === 0 ? (
              <p>No posts</p>
            ) : (
              user.posts.map((post) => (
                <div className="profilePost" key={post._id}>
                  {post}
                </div>
              ))
            )}
          </div>
        </>
      )}
<div className="errors">
        {typeof error === "object" ? (
          error.map((item) => <p key={item.msg}>{item.msg}</p>)
        ) : typeof error === "string" ? (
      <p className="error">{error}</p>
    </div>
  );
}
