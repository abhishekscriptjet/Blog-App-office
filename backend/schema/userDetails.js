const mongoose = require("mongoose");

const userDetailsSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
  },
  user: {
    type: Object,
    require: true,
  },
  noOfPost: {
    type: Number,
  },
  following: {
    type: Array,
  },
  follower: {
    type: Array,
  },
  likedBlog: {
    type: Array,
  },
  disLikedBlog: {
    type: Array,
  },
  commentBlog: {
    type: Array,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userid",
  },
  userDetailsDate: {
    type: Date,
    require: true,
  },
});

const UserDetails = mongoose.model("userDetails", userDetailsSchema);

module.exports = UserDetails;
