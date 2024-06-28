const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: Schema.Types.String, ref: "User", required: true },
  timestamp: { type: String, required: true },
  text: { type: String, required: true, minLength: 1, maxLength: 30 },
  postID: { type: Schema.Types.ObjectId, ref: "Posts", required: true },
});

module.exports = mongoose.model("Comments", CommentsSchema);
