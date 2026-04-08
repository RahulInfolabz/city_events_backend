const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./db/dbConnect");
require("dotenv").config();

// ── Common APIs ───────────────────────────────────────────────────────────────
const Logout = require("./apis/common/logout");
const Session = require("./apis/common/session");
const { Login } = require("./apis/common/login");
const { Signup } = require("./apis/common/signup");
const { ChangePassword } = require("./apis/common/changePassword");

// ── Public APIs ───────────────────────────────────────────────────────────────
const { GetCategories } = require("./apis/user/GetCategories");
const { GetFestivals } = require("./apis/user/GetFestivals");
const { GetEvents } = require("./apis/user/GetEvents");
const { GetEventDetails } = require("./apis/user/GetEventDetails");
const { GetFeedbacks } = require("./apis/user/GetFeedbacks");

// ── User APIs ─────────────────────────────────────────────────────────────────
const { UpdateProfile } = require("./apis/user/UpdateProfile");
const { AddEventInquiry } = require("./apis/user/AddEventInquiry");
const { MyEventInquiries } = require("./apis/user/MyEventInquiries");
const { AddGeneralInquiry } = require("./apis/user/AddGeneralInquiry");
const { MyGeneralInquiries } = require("./apis/user/MyGeneralInquiries");
const { AddFeedback } = require("./apis/user/AddFeedback");

// ─────────────────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "city_events_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ── DB Connect ────────────────────────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────────────────────────────────────
//  COMMON APIs
// ─────────────────────────────────────────────────────────────────────────────
app.post("/signup", Signup);
app.post("/login", Login);
app.get("/logout", Logout);
app.get("/session", Session);
app.post("/changePassword", ChangePassword);

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC APIs (no auth required)
// ─────────────────────────────────────────────────────────────────────────────

// Categories
app.get("/categories", GetCategories);

// Festivals
app.get("/festivals", GetFestivals);

// Events (filters: ?category_id= / ?festival_id= / ?min_price= / ?max_price=)
app.get("/events", GetEvents);
app.get("/events/:id", GetEventDetails);

// Feedbacks (public display)
app.get("/feedbacks", GetFeedbacks);

// ─────────────────────────────────────────────────────────────────────────────
//  USER APIs (session required)
// ─────────────────────────────────────────────────────────────────────────────

// Profile
app.post("/user/updateProfile", UpdateProfile);

// Event Inquiries
app.post("/user/addEventInquiry", AddEventInquiry);
app.get("/user/myEventInquiries", MyEventInquiries);

// General Inquiries
app.post("/user/addGeneralInquiry", AddGeneralInquiry);
app.get("/user/myGeneralInquiries", MyGeneralInquiries);

// Feedback
app.post("/user/addFeedback", AddFeedback);

app.get("/", (req, res) => {
  res.json({
    message: "City Events Server Started"
  })
});

// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`✅ City Events server started on PORT ${PORT}!`)
);
