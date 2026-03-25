const connectDB = require("../../db/dbConnect");

async function GetFestivals(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("festivals");

    const festivals = await collection
      .find({ status: true })
      .sort({ festival_name: 1 })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Festivals fetched successfully",
      data: festivals,
    });
  } catch (error) {
    console.error("GetFestivals.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { GetFestivals };
