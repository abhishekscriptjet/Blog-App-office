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

    const userDetails = {
      userid: userId,
      user: user,
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
      if (details === null) {
        const userDetails = new UserDetails({
          userid: userId,
          user: user,
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

router.get("/getuserdetails", fetchuser, async (req, res) => {
  try {
    const details = await UserDetails.find({ userid: req.userid });
    res.status(200).json({ success: true, details: details, msg: "Loaded" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.get("/getalluser", async (req, res) => {
  try {
    const details = await UserDetails.find();
    res.status(200).json({ success: true, details: details, msg: "Loaded" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Internel server error" });
  }
});

router.put("/setblogcount", fetchuser, async (req, res) => {
  try {
    const blogs = await blog.find({ userid: req.userid });
    const count = {
      noOfPost: blogs.length,
    };

    const details = await UserDetails.findOneAndUpdate(
      { userid: req.userid },
      { noOfPost: blogs.length }
    );
    res.status(200).json({ success: true, count: blogs.length, msg: "Loaded" });
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

router.put("/setunfollow", fetchuser, async (req, res) => {
  try {
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

module.exports = router;
