const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true, // ✅ fixed
  },
  email: {
    type: String,
    unique: true,
    required: true, // ✅ fixed
  },
  password: {
    type: String,
    required: true, // ✅ fixed
  },
  HighScore: {
    type: Number,
    default: 0,
  },
});

// create model
const UserModel = mongoose.model("User", userSchema);

// export model
module.exports = UserModel;
