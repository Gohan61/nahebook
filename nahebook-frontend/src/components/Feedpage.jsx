import { useEffect, useState } from "react";
import Post from "./Post";
import { useOutletContext } from "react-router-dom";

export default function Feedpage() {
  const [url, setUrl] = useState(
    `http://localhost:3000/post/${localStorage.getItem("userId")}`,
  );
  const [feed, setFeed] = useState({
    ownPosts: [],
    followerPosts: [],
  });
  const [error, setError] = useState(undefined);
  const { handleLike, handleUnlike, refresh } = useOutletContext();
  const postInFeed = true;

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
        if (res.ownPosts || res.followerPosts) {
          setFeed({
            ownPosts: res.ownPosts,
            followerPosts: res.followerPosts.flat(),
          });
        } else if (res.error.message === "Could not find follower's posts") {
          throw res.error.message;
        } else if (res.error.message === "Could not find own posts") {
          throw res.error.message;
        }
      })
      .catch((err) => {
        setError(err);
      });
  }, [url, JSON.stringify(feed), refresh]);

  if (feed.ownPosts.length === 0 && feed.followerPosts.length === 0) {
    return <p>Loading</p>;
  } else {
    return (
      <div className="feed">
        {feed.followerPosts.map((post) => (
          <Post
            props={{ post, handleLike, handleUnlike, postInFeed }}
            key={post._id}
          />
        ))}
        {feed.ownPosts.map((post) => (
          <Post
            props={{ post, handleLike, handleUnlike, postInFeed }}
            key={post._id}
          />
        ))}
      </div>
    );
  }
}
