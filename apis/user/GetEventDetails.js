const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetEventDetails(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event ID",
      });
    }

    const db = await connectDB();
    const eventsCollection = db.collection("events");

    const pipeline = [
      { $match: { _id: new ObjectId(id), status: true } },
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
    ];

    const result = await eventsCollection.aggregate(pipeline).toArray();

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event details fetched successfully",
      data: result[0],
    });
  } catch (error) {
    console.error("GetEventDetails.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { GetEventDetails };
