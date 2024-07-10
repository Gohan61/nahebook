import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Post from "./Post";
import he from "he";
import "../stylesheets/Forms.css";
import "../stylesheets/Profile.css";

export default function Profile() {
  const [url, setUrl] = useState(
    `http://localhost:3000/user/profile/${localStorage.getItem("userId")}`,
  );
  const [user, setUser] = useState("");
  const [error, setError] = useState(undefined);
  const [updateProfile, setupdateProfile] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    age: "",
    bio: "",
  });
  const [updateStatus, setUpdateStatus] = useState(false);
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
          setUser({ ...res.user, posts: res.user.posts.reverse() });
        } else {
          setError(res.error.message);
        }
      });
  }, [url, updateStatus, refresh]);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        first_name: updateProfile.first_name,
        last_name: updateProfile.last_name,
        username: updateProfile.username,
        password: updateProfile.password,
        age: updateProfile.age,
        bio: updateProfile.bio,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "Your profile is updated") {
          setUpdateStatus(false);
          setError(undefined);
        } else if (res.message === "Username already exists") {
          setError(res.message);
        } else {
          throw res.errors;
        }
      })
      .catch((err) => {
        setError(err.errors);
      });
  };

  const handleDelete = (event, postId) => {
    event.preventDefault();

    const deletePrompt = confirm("Are you sure you want to delete this post?");

    if (deletePrompt) {
      fetch(`http://localhost:3000/post/${postId}`, {
        mode: "cors",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Token"),
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.message === "Post deleted") {
            refresh ? setRefresh(false) : setRefresh(true);
          } else {
            throw res.error.message;
          }
        })
        .catch((err) => {
          setError(err);
        });
    }
  };

  if (updateStatus) {
    return (
      <div className="updateForm">
        <div className="errors" data-testid="updateFormErrors">
          {typeof error === "string" ? (
            <p>{error}</p>
          ) : typeof error === "object" ? (
            error.map((item) => {
              return (
                <p className="error" key={item.path}>
                  {item.msg}
                </p>
              );
            })
          ) : (
            ""
          )}
        </div>
        <form action="" method="put" className="profileUpdateForm">
          <label htmlFor="first_name">First name: </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={he.decode(updateProfile.first_name)}
            onChange={(e) =>
              setupdateProfile({ ...updateProfile, first_name: e.target.value })
            }
          />
          <label htmlFor="last_name">Last name: </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={he.decode(updateProfile.last_name)}
            onChange={(e) =>
              setupdateProfile({ ...updateProfile, last_name: e.target.value })
            }
          />
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            name="username"
            value={he.decode(updateProfile.username)}
            onChange={(e) =>
              setupdateProfile({ ...updateProfile, username: e.target.value })
            }
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={updateProfile.password}
            onChange={(e) =>
              setupdateProfile({ ...updateProfile, password: e.target.value })
            }
          />
          <label htmlFor="age">Age: </label>
          <input
            type="number"
            id="age"
            name="age"
            value={updateProfile.age}
            onChange={(e) =>
              setupdateProfile({ ...updateProfile, age: e.target.value })
            }
          />
          <label htmlFor="bio">Bio: </label>
          <textarea
            type="text"
            id="bio"
            name="bio"
            rows={"8"}
            value={he.decode(updateProfile.bio)}
            onChange={(e) =>
              setupdateProfile({ ...updateProfile, bio: e.target.value })
            }
          ></textarea>
          <button onClick={(e) => handleSubmit(e)}>Submit</button>
          <button
            onClick={() => {
              setUpdateStatus(false);
              setError(undefined);
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

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
            {user.username === "testing" ? (
              ""
            ) : (
              <>
                <button
                  onClick={() => {
                    setUpdateStatus(true);
                    setupdateProfile({
                      first_name: user.first_name,
                      last_name: user.last_name,
                      username: user.username,
                      password: "",
                      age: user.age,
                      bio: user.bio,
                    });
                  }}
                >
                  Update profile
                </button>
                <Link to={"/newpost"}>New post</Link>
              </>
            )}
          </div>

          <div className="profilePosts">
            {user.posts.length === 0 ? (
              <p>No posts</p>
            ) : (
              user.posts.map((post) => (
                <Post
                  props={{ post, handleLike, handleUnlike, handleDelete }}
                  key={post._id}
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
        {typeof likeError === "object" ? (
          likeError.map((item) => <p key={item.msg}>{item.msg}</p>)
        ) : typeof likeError === "string" ? (
          <p className="error">{likeError}</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
