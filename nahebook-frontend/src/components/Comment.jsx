import { useEffect, useState, useRef } from "react";

export default function Comment({ postId }) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState(undefined);
  const [listComment, setListComment] = useState(undefined);
  const [refresh, setRefresh] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const username = useRef(localStorage.getItem("username"));

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`http://localhost:3000/post/comment/${postId}`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        text: comment,
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "Comment saved") {
          setComment("");
          setError("");
          refresh ? setRefresh(false) : setRefresh(true);
        } else {
          throw res.errors.errors;
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  useEffect(() => {
    fetch(`http://localhost:3000/post/comment/${postId}`, {
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
        if (res.comments) {
          setListComment(res.comments);
        }
      });
  }, [refresh, postId]);

  const handleDelete = (event, commentId) => {
    event.preventDefault();

    fetch(`http://localhost:3000/post/comment/${postId}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        commentId: commentId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "Comment deleted") {
          refresh ? setRefresh(false) : setRefresh(true);
        } else {
          throw res.error;
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <div className="comments">
      <form action="" method="post">
        <label htmlFor="comment">New comment:</label>
        <textarea
          type="text"
          name="comment"
          id="comment"
          rows={"2"}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={(e) => handleSubmit(e)}>Submit</button>
      </form>
      <button onClick={() => setShowComment(!showComment)}>
        {showComment ? "Hide comments" : "Show comments"}
      </button>
      {showComment ? (
        <div className="commentList">
          {listComment
            ? listComment.map((item) => {
                return (
                  <div className="singleComment" key={item._id}>
                    <p className="username">{item.username}</p>
                    <p className="timestamp">{item.timestamp}</p>
                    <p className="text">{item.text}</p>
                    {username.current === item.username ? (
                      <button
                        onClick={(e, commentId) => handleDelete(e, item._id)}
                      >
                        Delete comment
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })
            : "No comments"}
        </div>
      ) : (
        ""
      )}
      <div className="errors" data-testid="commentErrors">
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
