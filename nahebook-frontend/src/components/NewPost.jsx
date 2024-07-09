import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import he from "he";

export default function NewPost() {
  const location = useLocation();
  const post = location.state ? location.state.post : undefined;
  const [newPost, setNewPost] = useState(() => {
    if (post) {
      return { text: post.text };
    } else {
      return { text: undefined };
    }
  });
  const [error, setError] = useState(undefined);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setFileToBase64(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:3000/post/new", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        text: newPost.text,
        imgUrl: imageBase64,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "Post saved") {
          navigate("/profile");
        } else if (res.message) {
          throw res.message;
        } else {
          throw res.errors.errors;
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    fetch(`http://localhost:3000/post/${post._id}`, {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        text: newPost.text,
        imgUrl: undefined || imageBase64,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "Post saved") {
          navigate("/profile");
        } else {
          throw res.errors.errors;
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  if (post) {
    return (
      <div className="updatePost">
        <h2>Update post</h2>
        <form action="" method="post">
          <label htmlFor="text">Text: </label>
          <textarea
            type="text"
            name="text"
            id="text"
            rows={"3"}
            value={he.decode(newPost.text)}
            onChange={(e) => setNewPost({ text: e.target.value })}
          />
          <label htmlFor="imgUrl">Click to upload new image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            id="imgUrl"
            onChange={(e) => handleImage(e)}
          />
          <button onClick={(e) => handleUpdate(e)}>Update</button>
        </form>
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
  } else {
    return (
      <div className="newPost">
        <h2>New post</h2>
        <div className="errors" data-testid="newpostErrors">
          {typeof error === "object" ? (
            error.map((item) => <p key={item.msg}>{item.msg}</p>)
          ) : typeof error === "string" ? (
            <p className="error">{error}</p>
          ) : (
            ""
          )}
        </div>
        <form action="" method="post" className="newPostForm">
          <label htmlFor="text">Text: </label>
          <textarea
            type="text"
            name="text"
            id="text"
            rows={"3"}
            onChange={(e) => setNewPost({ text: e.target.value })}
          />
          <label htmlFor="imgUrl">Upload image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            id="imgUrl"
            onChange={(e) => handleImage(e)}
          />
          <button onClick={(e) => handleSubmit(e)}>Submit</button>
        </form>
      </div>
    );
  }
}
