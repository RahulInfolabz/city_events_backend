const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function MyEventInquiries(req, res) {
  try {
    const user = req.session.user;
    if (!user || user.session.role !== "User") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!",
      });
    }

    const db = await connectDB();
    const inquiryCollection = db.collection("event_inquiries");

    const inquiries = await inquiryCollection
      .aggregate([
        { $match: { user_id: new ObjectId(user.session._id) } },
        {
          $lookup: {
            from: "events",
            localField: "event_id",
            foreignField: "_id",
            as: "event",
          },
        },
        { $unwind: { path: "$event", preserveNullAndEmptyArrays: true } },
        { $sort: { inquiry_date: -1 } },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Event inquiries fetched successfully",
      data: inquiries,
    });
  } catch (error) {
    console.error("MyEventInquiries.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { MyEventInquiries };
