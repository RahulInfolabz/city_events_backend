const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateProfile(req, res) {
  try {
    const user = req.session.user;
    if (!user || user.session.role !== "User") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!",
      });
    }

    const { full_name, mobile_no, city, profile_image } = req.body;

    if (!full_name || !mobile_no || !city) {
      return res.status(400).json({
        success: false,
        message: "Full name, mobile number and city are required",
      });
    }

    const db = await connectDB();
    const userCollection = db.collection("users");

    const updateFields = {
      full_name,
      mobile_no,
      city,
      updated_at: new Date(),
    };

    if (profile_image) updateFields.profile_image = profile_image;

    const result = await userCollection.updateOne(
      { _id: new ObjectId(user.session._id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update session with latest data
    const updatedUser = await userCollection.findOne({
      _id: new ObjectId(user.session._id),
    });
    req.session.user = { session: updatedUser, isAuth: true };

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("UpdateProfile.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { UpdateProfile };
