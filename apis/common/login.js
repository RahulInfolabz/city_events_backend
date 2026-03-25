const connectDB = require("../../db/dbConnect");

async function Login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required",
      });
    }

    const db = await connectDB();
    const collection = db.collection("users");
    const user = await collection.findOne({ email, password, role });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.status === "Inactive" || user.status === "Blocked") {
      return res.status(401).json({
        success: false,
        message: "Your account is inactive or blocked",
      });
    }

    // Create session
    req.session.user = { session: user, isAuth: true };
    const userData = req.session.user;

    return res.status(200).json({
      userData,
      success: true,
      message: "Login Successful",
    });
  } catch (error) {
    console.error("login.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
}

module.exports = { Login };
