async function Session(req, res) {
  try {
    const userDatas = req.session.user;

    if (!userDatas) {
      return res.status(401).json({
        success: false,
        message: "No session created!",
      });
    }

    return res.status(200).json({
      sessionData: userDatas,
      success: true,
      message: "Session retrieved successfully",
    });
  } catch (error) {
    console.error("session.js: ", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = Session;
