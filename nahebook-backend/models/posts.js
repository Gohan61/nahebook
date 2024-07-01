const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, ref: "User", required: true },
  date: { type: String, required: true },
  text: { type: String, required: false, maxLength: 50 },
  imgUrl: { type: String, required: false },
  likes: [{ type: Schema.Types.ObjectId, required: false, ref: "User" }],
});

module.exports = mongoose.model("Posts", PostsSchema);
