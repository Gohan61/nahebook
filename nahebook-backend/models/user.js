const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 2, maxLength: 50 },
  last_name: { type: String, required: true, minLength: 2, maxLength: 50 },
  username: { type: String, required: true, minLength: 5, maxLength: 20 },
  password: { type: String, required: true, minLength: 5, maxLength: 100 },
  age: { type: Number, required: false },
  bio: { type: String, required: true, minLength: 1, maxLength: 200 },
  profile_picture: { type: String, required: false },
  posts: [{ type: Schema.Types.ObjectId, ref: "Posts", required: false }],
  following: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
  pendingFollow: [
    { type: Schema.Types.ObjectId, ref: "User", required: false },
  ],
  receivedRequestFollow: [
    { type: Schema.Types.ObjectId, ref: "User", required: false },
  ],
});

module.exports = mongoose.model("User", UserSchema);
