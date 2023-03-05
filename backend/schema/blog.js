const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userid",
  },
  topic: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  comment: {
    type: Array,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  upVote: {
    type: Array,
  },
  downVote: {
    type: Array,
  },
});

const blog = mongoose.model("blog", blogSchema);
module.exports = blog;
