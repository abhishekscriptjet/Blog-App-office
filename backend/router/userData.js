const express = require("express");
const UserDetails = require("../schema/userDetails");
const { body, validationResult } = require("express-validator");
const fetchuser = require("./fetchUser");
const User = require("../schema/user");
const blog = require("../schema/blog");
const router = express.Router();

router.post("/createuserdetails", fetchuser, async (req, res) => {
  try {
    const userId = await req.userid;
    const user = await User.findById(userId).select("-password");
    let details = await UserDetails.findOne({ userid: userId });
    const blogs = await blog.find({ userid: userId });
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      city,
      state,
      country,
      pincode,
      profession,
      profileImg,
    } = req.body;

    // For Edit
    const userDetails = {
      userid: userId,
      user: user,
      name: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      dateOfBirth: dateOfBirth,
      city: city,
      state: state,
      country: country,
      pincode: pincode,
      profession: profession,
      profileImg: profileImg,
      noOfPost: blogs.length,
    };

    if (user) {
      //For Create
      if (details === null) {
        const userDetails = new UserDetails({
          userid: userId,
          user: user,
          name: `${firstName} ${lastName}`,
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          dateOfBirth: dateOfBirth,
          city: city,
          state: state,
          country: country,
          pincode: pincode,
          profession: profession,
          profileImg: profileImg,
          noOfPost: blogs.length,
          following: [],
          follower: [],
          likedBlog: [],
          disLikedBlog: [],
          commentBlog: [],
          userDetailsDate: new Date(),
        });
        const createUserDetails = await userDetails.save();
        res.status(200).json({
          success: true,
          details: createUserDetails,
          msg: "Details Added",
        });
      } else if (details.userid.toString() === userId) {
        details = await UserDetails.findOneAndUpdate(
          { userid: userId },
          { $set: userDetails },
          { new: true }
        );
        res
          .status(200)
          .json({ success: true, details: details, msg: "Details Updated" });
      } else {
        res
          .status(400)
          .json({ success: false, error: "Already added Details" });
      }
    } else {
      res
        .status(400)
        .json({ success: false, error: "Not allowed to add Details" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: "Internal server error" });
  }
});

// router.delete("/deleteuserdetails", fetchuser, async (req, res) => {
//   try {
//     const data = await UserDetails.findOne({ userid: req.userid });
//     if (data) {
//       const details = await UserDetails.findByIdAndRemove(data._id);
//       res.status(200).json({ success: true, msg: "Details Deleted" });
//     } else {
//       res.status(400).json({ success: false, error: "Not found" });
//     }
//   } catch (error) {
//     res.status(400).json({ success: false, error: "Internel server error" });
//   }
// });

router.delete("/deleteuserdetails", fetchuser, async (req, res) => {
  try {
    const data = await UserDetails.findOne({ userid: req.userid });
    if (data) {
      await data.follower.map(async (flwr) => {
        const followerUserDetails = await UserDetails.findOne({ userid: flwr });
        if (followerUserDetails) {
          if (followerUserDetails.following.includes(req.userid)) {
            const details = await UserDetails.findOneAndUpdate(
              { userid: flwr },
              { $pull: { following: req.userid } }
            );
          }
        }
      });

      await data.following.map(async (flwg) => {
        const followingUserDetails = await UserDetails.findOne({
          userid: flwg,
        });
        if (followingUserDetails) {
          if (followingUserDetails.follower.includes(req.userid)) {
            const details = await UserDetails.findOneAndUpdate(
              { userid: flwg },
              { $pull: { follower: req.userid } }
            );
          }
        }
      });

      await data.likedBlog.map(async (blg) => {
        const likedBlogDetails = await blog.findById(blg);
        if (likedBlogDetails) {
          if (likedBlogDetails.upVote.includes(req.userid)) {
            const details = await blog.findOneAndUpdate(
              { _id: blg },
              { $pull: { upVote: req.userid } }
            );
          }
        }
      });

      await data.disLikedBlog.map(async (blg) => {
        const disLikedBlogDetails = await blog.findById(blg);
        if (disLikedBlogDetails) {
          if (disLikedBlogDetails.downVote.includes(req.userid)) {
            const details = await blog.findOneAndUpdate(
              { _id: blg },
              { $pull: { downVote: req.userid } }
            );
          }
        }
      });

      await data.commentBlog.map(async (blg) => {
        const commentBlogDetails = await blog.findOne({ _id: blg });
        if (commentBlogDetails) {
          commentBlogDetails.comment.map(async (cmt) => {
            let commentUserId = cmt.commentUser;
            if (commentUserId.toString() === req.userid) {
              const details = await blog.findOneAndUpdate(
                { _id: blg },
                { $pull: { comment: { commentUser: req.userid } } }
              );
            }
          });
        }
      });

      const userBlog = await blog.find({ userid: req.userid });

      if (userBlog.length > 0) {
        userBlog.map(async (blg) => {
          const blogUserId = blg.userid;
          const blogID = blg._id;

          if (blogUserId.toString() === req.userid) {
            let like = blg.upVote;
            await like.map(async (id) => {
              const likeUserDetails = await UserDetails.findOneAndUpdate(
                { userid: id },
                { $pull: { likedBlog: blogID.toString() } },
                { new: true }
              );
            });

            let disLike = blg.downVote;
            await disLike.map(async (id) => {
              const disLikeUserDetails = await UserDetails.findOneAndUpdate(
                { userid: id },
                { $pull: { disLikedBlog: blogID.toString() } },
                { new: true }
              );
            });

            let comment = blg.comment;
            await comment.map(async (comment) => {
              const commentUserDetails = await UserDetails.findOneAndUpdate(
                { userid: comment.commentUser },
                { $pull: { commentBlog: blogID.toString() } },
                { new: true }
              );
            });
          }
        });
      }

      const user = await User.findByIdAndDelete(req.userid);
      const details = await UserDetails.findByIdAndRemove(data._id);
      const deleteUserBlog = await blog.deleteMany({
        userid: req.userid,
      });
      res.status(200).json({ success: true, msg: "Account Deleted" });
    } else {
      res.status(400).json({ success: false, error: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.get("/getuserdetails", fetchuser, async (req, res) => {
  try {
    const details = await UserDetails.find({ userid: req.userid });
    res.status(200).json({ success: true, details: details, msg: "Loaded" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.get("/getclickuserdetails/:id", fetchuser, async (req, res) => {
  try {
    const details = await UserDetails.find({ userid: req.params.id });
    res.status(200).json({ success: true, details: details, msg: "Loaded" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.get("/getalluser/:size", async (req, res) => {
  try {
    const details = await UserDetails.find().limit(req.params.size);
    res.status(200).json({ success: true, details: details, msg: "Loaded" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.put("/setfollowing", fetchuser, async (req, res) => {
  try {
    const followingID = req.body.id;
    const oldDetails = await UserDetails.find({ userid: req.userid });
    const oldFollowing = oldDetails[0].following;
    const include = oldFollowing.includes(followingID.toString());
    if (!include && followingID !== req.userid) {
      const details = await UserDetails.findOneAndUpdate(
        { userid: req.userid },
        { $push: { following: followingID } },
        { new: true }
      );
      const addFollower = await UserDetails.findOneAndUpdate(
        { userid: followingID },
        { $push: { follower: req.userid } },
        { new: true }
      );
      res.status(200).json({
        success: true,
        msg: "Follow done",
      });
    } else {
      const unFollowId = req.body.id;
      const details = await UserDetails.findOneAndUpdate(
        { userid: req.userid },
        { $pull: { following: unFollowId } }
      );
      const addFollower = await UserDetails.findOneAndUpdate(
        { userid: unFollowId },
        { $pull: { follower: req.userid } }
      );
      res.status(200).json({
        success: true,
        msg: "Unfollow done",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.get("/getfollowing", fetchuser, async (req, res) => {
  try {
    const details = await UserDetails.find({ userid: req.userid });
    const following = details[0].following;
    const followingDetails = await UserDetails.find({ userid: following });
    res.status(200).json({
      success: true,
      followingDetails: followingDetails,
      msg: "Get Following",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.get("/getfollower", fetchuser, async (req, res) => {
  try {
    const details = await UserDetails.find({ userid: req.userid });
    const follower = details[0].follower;
    const followerDetails = await UserDetails.find({ userid: follower });
    res.status(200).json({
      success: true,
      followerDetails: followerDetails,
      msg: "Get Follower",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.put("/getbloguserdetails", fetchuser, async (req, res) => {
  try {
    const details = await UserDetails.find({ userid: req.body.id });
    res.status(200).json({ success: true, details: details, msg: "Loaded" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.post("/getclickfollowing", fetchuser, async (req, res) => {
  try {
    const details = await UserDetails.find({ userid: req.body.id });
    const following = details[0].following;
    const followingDetails = await UserDetails.find({ userid: following });
    res.status(200).json({
      success: true,
      followingDetails: followingDetails,
      msg: "Get Following",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.post("/getclickfollower", fetchuser, async (req, res) => {
  try {
    const details = await UserDetails.find({ userid: req.body.id });
    const follower = details[0].follower;
    const followerDetails = await UserDetails.find({ userid: follower });
    res.status(200).json({
      success: true,
      followerDetails: followerDetails,
      msg: "Get Follower",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.get("/getsearchuser/:size/:query", async (req, res) => {
  try {
    const details = await UserDetails.find({
      $or: [
        {
          firstName: {
            $regex: new RegExp("^" + req.params.query.toLowerCase(), "i"),
          },
        },
        {
          lastName: {
            $regex: new RegExp("^" + req.params.query.toLowerCase(), "i"),
          },
        },
        {
          name: {
            $regex: new RegExp("^" + req.params.query.toLowerCase(), "i"),
          },
        },
        { "user.name": { $regex: req.params.query } },
      ],
    }).limit(req.params.size);
    res.status(200).json({ success: true, details: details, msg: "Loaded" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

module.exports = router;
