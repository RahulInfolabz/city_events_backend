const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddFeedback(req, res) {
  try {
    const user = req.session.user;
    if (!user || user.session.role !== "User") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!",
      });
    }

    const { feedback_message, rating } = req.body;

    if (!feedback_message || !rating) {
      return res.status(400).json({
        success: false,
        message: "Feedback message and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const db = await connectDB();
    const feedbackCollection = db.collection("feedbacks");

    await feedbackCollection.insertOne({
      user_id: new ObjectId(user.session._id),
      feedback_message,
      rating: parseInt(rating),
      feedback_date: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("AddFeedback.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { AddFeedback };
