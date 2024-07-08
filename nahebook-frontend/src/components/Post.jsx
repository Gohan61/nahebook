import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Comment from "./Comment";
import "../stylesheets/Forms.css";

export default function Post({ props }) {
  const [like, setLike] = useState(false);
  const [unlike, setUnlike] = useState(false);

  return (
    <div className="profilePost">
      <p className="text">{props.post.text}</p>
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
              <li>{props.post.likes.map((user) => user)}</li>
            </ul>

            <button onClick={() => setLike(!like)}>
              {!like ? "See who liked this post" : "Hide likes"}
            </button>
          </>
        )}
      </div>
      {unlike ? (
        <button
          onClick={(e) => {
            props.handleUnlike(e, props.post._id);
            setUnlike(!unlike);
          }}
        >
          Unlike
        </button>
      ) : (
        <button
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
          <button onClick={(e) => props.handleDelete(e, props.post._id)}>
            Delete post
          </button>
          <Link to={"/newpost"} state={{ post: props.post }}>
            Update post
          </Link>
        </>
      )}
      <Comment postId={props.post._id} />
    </div>
  );
}
