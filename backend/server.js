// server.js
// environment vars
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

// route imports
const authRoutes = require('./routes/authRoutes');
const docSetRoutes = require('./routes/docSetRoutes');

// express app
const app = express();

// middleware
app.use(express.json()); // to get req body

app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://localhost:19000",
      "http://localhost:19006",
    ],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // days hours minutes seconds milli
    },
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});
// routes
app.use('/api/auth', authRoutes);
app.use('/api/docSet', docSetRoutes);


// basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "connected to DB and listening on the port " + process.env.PORT
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });

// listening on the port
