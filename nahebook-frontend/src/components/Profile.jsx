import { useEffect, useState } from "react";

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
  }, [url, updateStatus]);

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
          setupdateProfile(false);
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

  if (updateStatus) {
    return (
      <div className="updateForm">
        <form action="" method="put" className="profileUpdateForm">
          <label htmlFor="first_name">First name: </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={updateProfile.first_name}
            onChange={(e) =>
              setupdateProfile({ ...updateProfile, first_name: e.target.value })
            }
          />
          <label htmlFor="last_name">Last name: </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={updateProfile.last_name}
            onChange={(e) =>
              setupdateProfile({ ...updateProfile, last_name: e.target.value })
            }
          />
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            name="username"
            value={updateProfile.username}
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
            value={updateProfile.bio}
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
          <button onClick={() => setUpdateStatus(true)}>Update profile</button>
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
      <p className="error">{error}</p>
    </div>
  );
}
