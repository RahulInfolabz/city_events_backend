async function Logout(req, res) {
  const sessions = req.session.user;
  if (!sessions) {
    return res.status(401).json({ success: false, message: "Already Logged Out" });
  }
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ success: false, message: "Logout Failed!" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ success: true, message: "Logout Successful!" });
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = Logout;
