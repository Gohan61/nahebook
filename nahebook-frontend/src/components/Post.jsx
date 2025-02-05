import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Comment from "./Comment";
import he from "he";
import "../stylesheets/Forms.css";
import "../stylesheets/Post.css";

export default function Post({ props }) {
  const [like, setLike] = useState(false);
  const [unlike, setUnlike] = useState(false);

  return (
    <div className="profilePost">
      <p className="text">{he.decode(props.post.text)}</p>
      <Link
        className="profileLink"
        to={"/userprofiles"}
        state={{ userId: props.post.userId }}
      >
        {he.decode(props.post.username)}
      </Link>
      <p className="date">{props.post.date}</p>
      {props.post.imgUrl ? <img src={props.post.imgUrl.url} alt=""></img> : ""}
      <div className="likes">
        <p className="amountOfLikes">
          <span>Likes: </span>
          {props.post.likes.length === 0 ? "No likes" : props.post.likes.length}
        </p>
        {props.post.likes.length === 0 ? (
          ""
        ) : (
          <>
            <ul style={{ display: like ? "block" : "none" }}>
              {props.post.likes.map((user) => (
                <li key={user}>{he.decode(user)}</li>
              ))}
            </ul>

            <button onClick={() => setLike(!like)}>
              {!like ? "See who liked this post" : "Hide likes"}
            </button>
          </>
        )}
      </div>
      {props.post.likes.includes(localStorage.getItem("username")) ? (
        <button
          className="likeButton"
          onClick={(e) => {
            props.handleUnlike(e, props.post._id);
            setUnlike(!unlike);
          }}
        >
          Unlike
        </button>
      ) : (
        <button
          className="likeButton"
          onClick={(e) => {
            props.handleLike(e, props.post._id);
            setUnlike(!unlike);
          }}
        >
          Like
        </button>
      )}
      {props.postInFeed || props.notMyProfile ? (
        ""
      ) : (
        <>
          <button
            className="deleteButton"
            onClick={(e) => props.handleDelete(e, props.post._id)}
          >
            Delete post
          </button>
          <Link
            className="updatePost"
            to={"/newpost"}
            state={{ post: props.post }}
          >
            Update post
          </Link>
        </>
      )}
      <Comment postId={props.post._id} />
    </div>
  );
}
