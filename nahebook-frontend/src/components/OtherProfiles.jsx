import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import Post from "./Post";
import he from "he";

export default function Profile() {
  const location = useLocation();
  const userIdProp = location.state.userId;
  const [url, setUrl] = useState(
    `https://nahebook-backend.fly.dev/user/profile/${userIdProp}`,
  );
  const [user, setUser] = useState("");
  const [error, setError] = useState(undefined);
  const notMyProfile = true;
  const { refresh, setRefresh, handleLike, handleUnlike, likeError } =
    useOutletContext();

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
  }, [url, refresh]);

  return (
    <div className="profile">
      <h2>Your profile</h2>
      {!user ? (
        <p>Loading</p>
      ) : (
        <>
          <div className="profileInfo">
            <img src={user.profile_picture} alt="Avatar of your user profile" />
            <p className="first_name">
              <span>First name:</span> {he.decode(user.first_name)}
            </p>
            <p className="last_name">
              <span>Last name:</span> {he.decode(user.last_name)}
            </p>
            <p className="username">
              <span>Username:</span> {he.decode(user.username)}
            </p>
            <p className="age">
              <span>Age:</span> {user.age ? user.age : "Not specified"}
            </p>
            <p className="bio">
              <span>Bio:</span> {he.decode(user.bio)}
            </p>
          </div>
          <div className="profilePosts">
            {user.posts.length === 0 ? (
              <p>No posts</p>
            ) : (
              user.posts.map((post) => (
                <Post
                  key={post._id}
                  props={{
                    post,
                    notMyProfile,
                    handleLike,
                    handleUnlike,
                  }}
                />
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
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
