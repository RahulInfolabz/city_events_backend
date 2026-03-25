const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddEventInquiry(req, res) {
  try {
    const user = req.session.user;
    if (!user || user.session.role !== "User") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!",
      });
    }

    const { event_id, inquiry_message } = req.body;

    if (!event_id || !inquiry_message) {
      return res.status(400).json({
        success: false,
        message: "Event ID and inquiry message are required",
      });
    }

    if (!ObjectId.isValid(event_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event ID",
      });
    }

    const db = await connectDB();
    const eventsCollection = db.collection("events");
    const inquiryCollection = db.collection("event_inquiries");

    // Verify event exists
    const eventExists = await eventsCollection.findOne({
      _id: new ObjectId(event_id),
    });

    if (!eventExists) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await inquiryCollection.insertOne({
      user_id: new ObjectId(user.session._id),
      event_id: new ObjectId(event_id),
      inquiry_message,
      inquiry_status: "Pending",
      inquiry_date: new Date(),
      response_message: "",
      response_date: null,
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
    });
  } catch (error) {
    console.error("AddEventInquiry.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { AddEventInquiry };
