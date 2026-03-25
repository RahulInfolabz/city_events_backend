const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetEvents(req, res) {
  try {
    const { category_id, festival_id, min_price, max_price } = req.query;

    const db = await connectDB();
    const eventsCollection = db.collection("events");

    // Build match stage
    const matchStage = { status: true };

    if (category_id && ObjectId.isValid(category_id)) {
      matchStage.category_id = new ObjectId(category_id);
    }

    if (festival_id && ObjectId.isValid(festival_id)) {
      matchStage.festival_id = new ObjectId(festival_id);
    }

    if (min_price || max_price) {
      matchStage.ticket_price = {};
      if (min_price) matchStage.ticket_price.$gte = parseFloat(min_price);
      if (max_price) matchStage.ticket_price.$lte = parseFloat(max_price);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "event_categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "festivals",
          localField: "festival_id",
          foreignField: "_id",
          as: "festival",
        },
      },
      { $unwind: { path: "$festival", preserveNullAndEmptyArrays: true } },
      { $sort: { event_date: 1 } },
    ];

    const events = await eventsCollection.aggregate(pipeline).toArray();

    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: events,
    });
  } catch (error) {
    console.error("GetEvents.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { GetEvents };
