const express = require("express");
const blog = require("../schema/blog");
const { body, validationResult } = require("express-validator");
const fetchuser = require("./fetchUser");
const User = require("../schema/user");
const UserDetails = require("../schema/userDetails");
const router = express.Router();

router.post(
  "/createblog",
  fetchuser,
  [body("topic").isString(), body("userid"), body("description").isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const userId = await req.userid;
      const user = await User.findById(userId).select("-password");
      const { topic, description, src } = req.body;
      // Create Blog
      if (user) {
        const blogs = new blog({
          userid: userId,
          topic: topic,
          description: description,
          src: src,
          comment: [],
          upVote: [],
          downVote: [],
          date: new Date(),
        });
        const creatBlog = await blogs.save();
        // Add Blog count in userDetails
        const allblogs = await blog.find({ userid: req.userid });
        const details = await UserDetails.findOneAndUpdate(
          { userid: req.userid },
          { noOfPost: allblogs.length }
        );
        await res.status(200).json({ success: true, creatBlog: creatBlog });
      } else {
        res
          .status(400)
          .json({ success: false, error: "Not allowed to create blog" });
      }
    } catch (error) {
      console.log("error ", error);
      res.status(400).json({ success: false, error: "Internal server error" });
    }
  }
);

router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.userid).select("-password");
    res.status(200).json({ success: true, user, msg: "Loaded" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.get("/getuserblogs", fetchuser, async (req, res) => {
  try {
    const blogs = await blog.find({ userid: req.userid });

    let withUserDetailsBlog = [];
    let commentUserDetailsBlog = [];
    for (const iterator of blogs) {
      const details = await UserDetails.find({
        userid: iterator.userid,
      });
      withUserDetailsBlog.push({ ...iterator._doc, userDetails: details[0] });
    }
    for (const iterator of withUserDetailsBlog) {
      let commentWithUserDetails = [];
      for (const iteratorComment of iterator.comment) {
        const details = await UserDetails.find({
          userid: iteratorComment.commentUser,
        });
        commentWithUserDetails.push({
          ...iteratorComment,
          userDetails: details[0],
        });
      }
      commentUserDetailsBlog.push({
        ...iterator,
        comment: commentWithUserDetails,
      });
    }

    res
      .status(200)
      .json({ success: true, blogs: commentUserDetailsBlog, msg: "Loaded" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.get("/getfollowingblog/:size", fetchuser, async (req, res) => {
  try {
    const details = await UserDetails.find({
      userid: req.userid,
    });
    if (!details[0]) {
      return res.status(400).json({
        success: false,
        followingBlog: [],
        navigate: true,
        error: "Please fill details",
      });
    }
    const following = details[0].following;
    const followingBlog = await blog
      .find({
        userid: [...following, req.userid],
      })
      .sort({ date: -1 })
      .limit(req.params.size);

    let withUserDetailsBlog = [];
    let commentUserDetailsBlog = [];
    for (const iterator of followingBlog) {
      const details = await UserDetails.find({
        userid: iterator.userid,
      });
      withUserDetailsBlog.push({ ...iterator._doc, userDetails: details[0] });
    }
    for (const iterator of withUserDetailsBlog) {
      let commentWithUserDetails = [];
      for (const iteratorComment of iterator.comment) {
        const details = await UserDetails.find({
          userid: iteratorComment.commentUser,
        });
        commentWithUserDetails.push({
          ...iteratorComment,
          userDetails: details[0],
        });
      }
      commentUserDetailsBlog.push({
        ...iterator,
        comment: commentWithUserDetails,
      });
    }

    res.status(200).json({
      success: true,
      followingBlog: commentUserDetailsBlog,
      msg: "Get Following Blog",
    });
  } catch (error) {
    // console.log("ERR ", error);
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

// router.get("/getfollowingblog/:size", fetchuser, async (req, res) => {
//   try {
//     const details = await UserDetails.find({
//       userid: req.userid,
//     });
//     const following = details[0].following;
//     const followingBlog = await blog
//       .find({
//         userid: [...following, req.userid],
//       })
//       .sort({ date: -1 })
//       .limit(req.params.size);
//     // console.log("Blog ", followingBlog);
//     res.status(200).json({
//       success: true,
//       followingBlog: followingBlog,
//       msg: "Get Following Blog",
//     });
//   } catch (error) {
//     // console.log("ERR ", error);
//     res.status(400).json({ success: false, error: "Internel server error" });
//   }
// });

router.delete("/deleteblog/:id", fetchuser, async (req, res) => {
  try {
    const getblog = await blog.findById(req.params.id);
    if (!getblog) {
      return res.status(400).json({ success: false, error: "Not Found" });
    }
    if (getblog.userid.toString() !== req.userid) {
      return res.status(400).json({ success: false, error: "Not Allowed" });
    }
    let like = getblog.upVote;
    like.map(async (id) => {
      const likeUserDetails = await UserDetails.findOneAndUpdate(
        { userid: id },
        { $pull: { likedBlog: req.params.id } },
        { new: true }
      );
    });

    let disLike = getblog.downVote;
    disLike.map(async (id) => {
      const disLikeUserDetails = await UserDetails.findOneAndUpdate(
        { userid: id },
        { $pull: { disLikedBlog: req.params.id } },
        { new: true }
      );
    });

    let comment = getblog.comment;
    comment.map(async (comment) => {
      const commentUserDetails = await UserDetails.findOneAndUpdate(
        { userid: comment.commentUser },
        { $pull: { commentBlog: req.params.id } },
        { new: true }
      );
    });

    const deleteblog = await blog.findByIdAndRemove(req.params.id);

    // Update Blog count in userDetails
    const allblogs = await blog.find({ userid: req.userid });
    const details = await UserDetails.findOneAndUpdate(
      { userid: req.userid },
      { noOfPost: allblogs.length }
    );

    res.status(200).json({ success: true, deleteblog: deleteblog });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Internal server error" });
  }
});

router.put(
  "/editblog/:id",
  fetchuser,
  [body("topic").isString(), body("userid"), body("description").isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { topic, description, comment, upVote, downVote, src } = req.body;
      const userId = await req.userid;
      const updatedBlog = {
        userid: userId,
        topic: topic,
        description: description,
        src: src,
        comment: comment,
        upVote: upVote,
        downVote: downVote,
      };
      let getblog = await blog.findById(req.params.id);
      if (!getblog) {
        return res.status(400).json({ success: false, error: "Not Found" });
      }
      if (getblog.userid.toString() !== userId) {
        return res.status(400).json({ success: false, error: "Not Allowed" });
      }
      getblog = await blog.findByIdAndUpdate(
        req.params.id,
        { $set: updatedBlog },
        { new: true }
      );
      res.status(200).json({ success: true, getblog: getblog });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: "Internal server error" });
    }
  }
);

router.put("/setlike", fetchuser, async (req, res) => {
  try {
    const likeID = req.body.id;
    const oldDetails = await blog.find({ _id: likeID });
    const oldLike = oldDetails[0].upVote;
    const include = oldLike.includes(req.userid);
    if (!include) {
      const like = await blog.findOneAndUpdate(
        { _id: likeID },
        { $push: { upVote: req.userid } },
        { new: true }
      );
      const dislike = await blog.findOneAndUpdate(
        { _id: likeID },
        { $pull: { downVote: req.userid } }
      );

      const oldDetailsUser = await UserDetails.find({ userid: req.userid });
      const oldDisLikedBlog = oldDetailsUser[0].disLikedBlog;
      const includeDisLikedBlog = oldDisLikedBlog.includes(likeID);
      if (!includeDisLikedBlog) {
        const user = await UserDetails.findOneAndUpdate(
          { userid: req.userid },
          { $push: { likedBlog: likeID } },
          { new: true }
        );
      } else {
        const userd = await UserDetails.findOneAndUpdate(
          { userid: req.userid },
          { $pull: { disLikedBlog: likeID } },
          { new: true }
        );
        const userl = await UserDetails.findOneAndUpdate(
          { userid: req.userid },
          { $push: { likedBlog: likeID } },
          { new: true }
        );
      }
      res.status(200).json({
        success: true,
        msg: "Liked done",
      });
    } else {
      const likeID = req.body.id;
      const details = await blog.findOneAndUpdate(
        { _id: likeID },
        { $pull: { upVote: req.userid } }
      );
      const user = await UserDetails.findOneAndUpdate(
        { userid: req.userid },
        { $pull: { likedBlog: likeID } }
      );
      res.status(200).json({
        success: true,
        msg: "Removelike",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.put("/setdislike", fetchuser, async (req, res) => {
  try {
    const disLikeID = req.body.id;
    const oldDetails = await blog.find({ _id: disLikeID });
    const oldDisLike = oldDetails[0].downVote;
    const include = oldDisLike.includes(req.userid);
    if (!include) {
      const disLike = await blog.findOneAndUpdate(
        { _id: disLikeID },
        { $push: { downVote: req.userid } },
        { new: true }
      );
      const like = await blog.findOneAndUpdate(
        { _id: disLikeID },
        { $pull: { upVote: req.userid } }
      );

      const oldDetailsUser = await UserDetails.find({ userid: req.userid });
      const oldLikedBlog = oldDetailsUser[0].likedBlog;
      const includeLikedBlog = oldLikedBlog.includes(disLikeID);
      if (!includeLikedBlog) {
        const user = await UserDetails.findOneAndUpdate(
          { userid: req.userid },
          { $push: { disLikedBlog: disLikeID } },
          { new: true }
        );
      } else {
        const userl = await UserDetails.findOneAndUpdate(
          { userid: req.userid },
          { $pull: { likedBlog: disLikeID } },
          { new: true }
        );
        const userd = await UserDetails.findOneAndUpdate(
          { userid: req.userid },
          { $push: { disLikedBlog: disLikeID } },
          { new: true }
        );
      }
      res.status(200).json({
        success: true,
        msg: "DisLiked done",
      });
    } else {
      const disLikeID = req.body.id;
      const details = await blog.findOneAndUpdate(
        { _id: disLikeID },
        { $pull: { downVote: req.userid } }
      );
      const user = await UserDetails.findOneAndUpdate(
        { userid: req.userid },
        { $pull: { disLikedBlog: disLikeID } }
      );
      res.status(200).json({
        success: true,
        msg: "RemoveDisLike",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.put("/setblogcomment", fetchuser, async (req, res) => {
  try {
    const userId = req.userid;
    const blogID = req.body.id;
    const blogs = await blog.findOne({ _id: blogID });
    if (blogs) {
      const find = await blog.findOne({
        _id: blogID,
        "comment.commentUser": userId,
      });
      const getUserDetails = await UserDetails.findOne({ userid: userId });
      if (!getUserDetails.commentBlog.includes(blogID)) {
        const updateUserDetails = await UserDetails.findOneAndUpdate(
          { userid: userId },
          { $push: { commentBlog: blogID } },
          { new: true }
        );
      }
      if (!find) {
        const addCommentUser = await blog.findOneAndUpdate(
          {
            _id: blogID,
          },
          {
            $push: {
              comment: {
                commentUser: userId,
                data: [{ text: req.body.text, commentDate: new Date() }],
              },
            },
          },
          { new: true }
        );
        const comment = addCommentUser.comment;
        let commentWithUserDetails = [];
        for (const iterator of comment) {
          const details = await UserDetails.find({
            userid: iterator.commentUser,
          });

          commentWithUserDetails.push({ ...iterator, userDetails: details[0] });
        }
        // console.log("userID ", commentWithUserDetails);
        res.status(200).json({
          success: true,
          comment: commentWithUserDetails,
          msg: "Comment done",
        });
      } else {
        const query = { _id: blogID };
        const updateDocument = {
          $push: {
            "comment.$[user].data": {
              text: req.body.text,
              commentDate: new Date(),
            },
          },
        };
        const options = {
          arrayFilters: [
            {
              "user.commentUser": userId,
            },
          ],
          new: true,
        };
        const result = await blog.updateOne(query, updateDocument, options);
        const getBlog = await blog.findOne({ _id: blogID });
        const comment = getBlog.comment;
        res.status(200).json({
          success: true,
          comment: comment,
          msg: "user found in blog",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        error: "Blog not found",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.put("/deleteblogcomment", fetchuser, async (req, res) => {
  try {
    const userId = req.userid;
    const blogID = req.body.blogId;
    const blogs = await blog.findOne({ _id: blogID });
    if (blogs) {
      blogs.comment.map(async (cmt) => {
        if (cmt.commentUser === userId) {
          if (cmt.data.length === 1) {
            const userDetails = await UserDetails.findOneAndUpdate(
              { userid: userId },
              { $pull: { commentBlog: blogID } },
              { new: true }
            );
          }
        }
      });
      const query = { _id: blogID };
      const updateDocument = {
        $pull: {
          "comment.$[user].data": {
            text: req.body.text,
            commentDate: req.body.date,
          },
        },
      };
      const options = {
        arrayFilters: [
          {
            "user.commentUser": userId,
          },
        ],
        new: true,
      };
      const result = await blog.updateOne(query, updateDocument, options);
      const getBlog = await blog.findOne({ _id: blogID });
      const comment = getBlog.comment;
      if (result.modifiedCount === 0) {
        res.status(400).json({
          success: false,
          comment: comment,
          error: "Not allowed",
        });
      } else {
        res.status(200).json({
          success: true,
          comment: comment,
          msg: "Comment Deleted",
        });
        // console.log("result ", result);
      }
    } else {
      res.status(400).json({
        success: false,
        error: "Blog not found",
      });
    }
  } catch (error) {
    console.log("Error ", error);
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.post("/getclickuserblog", fetchuser, async (req, res) => {
  try {
    const ClickUserBlog = await blog.find({
      userid: req.body.id,
    });
    res.status(200).json({
      success: true,
      ClickUserBlog: ClickUserBlog,
      msg: "Get User Blog",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.post("/getfollowingfilterblog/:size", fetchuser, async (req, res) => {
  try {
    const details = await UserDetails.find({
      userid: req.userid,
    });
    const following = details[0].following;
    const followingFilterBlog = await blog
      .find({
        userid: [...following, req.userid],
        topic: req.body.topic,
      })
      .sort({ date: -1 })
      .limit(req.params.size);

    let withUserDetailsBlog = [];
    let commentUserDetailsBlog = [];
    for (const iterator of followingFilterBlog) {
      const details = await UserDetails.find({
        userid: iterator.userid,
      });
      withUserDetailsBlog.push({ ...iterator._doc, userDetails: details[0] });
    }
    for (const iterator of withUserDetailsBlog) {
      let commentWithUserDetails = [];
      for (const iteratorComment of iterator.comment) {
        const details = await UserDetails.find({
          userid: iteratorComment.commentUser,
        });
        commentWithUserDetails.push({
          ...iteratorComment,
          userDetails: details[0],
        });
      }
      commentUserDetailsBlog.push({
        ...iterator,
        comment: commentWithUserDetails,
      });
    }

    res.status(200).json({
      success: true,
      followingFilterBlog: commentUserDetailsBlog,
      msg: "Get Following Blog",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

module.exports = router;
