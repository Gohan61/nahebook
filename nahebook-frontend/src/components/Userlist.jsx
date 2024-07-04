import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RestOfUsers from "./RestofUsers";
import ReceivedRequests from "./ReceivedRequests";
import PendingFollow from "./PendingFollow";
import Following from "./Following";

export default function Userlist() {
  const [url, setUrl] = useState(
    `http://localhost:3000/user/list/${localStorage.getItem("userId")}`,
  );
  const [userList, setUserList] = useState({
    user: undefined,
    users: undefined,
  });
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

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
        if (res.user || res.users) {
          setUserList({ user: res.user, users: res.users });
        } else {
          throw res.error.message;
        }
      })
      .catch((err) => {
        setError(err);
      });
  }, [url, refresh]);

  if (!userList.user) {
    return <p>Loading</p>;
  } else {
    return (
      <div className="userList">
        <h2>All users on Nahebook</h2>
        <Following
          props={{ user: userList.user, setError, refresh, setRefresh }}
        />
        <PendingFollow props={{ user: userList.user }} />
        <ReceivedRequests
          props={{ user: userList.user, setError, refresh, setRefresh }}
        />
        <RestOfUsers
          props={{ users: userList.users, setError, refresh, setRefresh }}
        />
      </div>
    );
  }
}
