const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function MyGeneralInquiries(req, res) {
  try {
    const user = req.session.user;
    if (!user || user.session.role !== "User") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!",
      });
    }

    const db = await connectDB();
    const inquiryCollection = db.collection("general_inquiries");

    const inquiries = await inquiryCollection
      .find({ user_id: new ObjectId(user.session._id) })
      .sort({ inquiry_date: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "General inquiries fetched successfully",
      data: inquiries,
    });
  } catch (error) {
    console.error("MyGeneralInquiries.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { MyGeneralInquiries };
