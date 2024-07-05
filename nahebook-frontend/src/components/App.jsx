import { useState } from "react";
import "../stylesheets/App.css";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function App() {
  const [loginStatus, setLoginStatus] = useState(() => {
    if (localStorage.getItem("Token")) {
      return true;
    } else {
      return false;
    }
  });
  const [refresh, setRefresh] = useState(false);
  const [likeError, setLikeError] = useState(undefined);

  const handleLike = (event, postId) => {
    event.preventDefault();

    fetch(`http://localhost:3000/post/like/${postId}`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "Like saved") {
          refresh ? setRefresh(false) : setRefresh(true);
        } else {
          throw res.error.message;
        }
      })
      .catch((err) => {
        setLikeError(err);
      });
  };

  const handleUnlike = (event, postId) => {
    event.preventDefault();

    fetch(`http://localhost:3000/post/unlike/${postId}`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "Like removed") {
          refresh ? setRefresh(false) : setRefresh(true);
        } else {
          throw res.error.message;
        }
      })
      .catch((err) => {
        setLikeError(err);
      });
  };

  return (
    <>
      <Navbar props={{ loginStatus, setLoginStatus }} />
      <Outlet
        context={{
          loginStatus,
          setLoginStatus,
          refresh,
          setRefresh,
          handleLike,
          handleUnlike,
          likeError,
        }}
      />
    </>
  );
}

export default App;
