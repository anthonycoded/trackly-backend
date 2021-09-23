const express = require("express");
const mongoose = require("mongoose");
require("./src/models/Users");
require("./src/models/Track");

const requireAuth = require("./src/middleware/requireAuth");

const authRoutes = require("./src/routes/authRoute");
const trackRoutes = require("./src/routes/trackRoutes");

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/tracks", trackRoutes);

///CONNECT TO DATABSE MONGODB
const mongoUri =
  "mongodb+srv://admin:2swisshype@cluster0.hvcdh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const connectDB = async () => {
  await mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!", error);
    });
};

connectDB();

app.get("/", requireAuth, (req, res) => {
  res.send(`your email: ${req.user.email}`);
});

//start server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`server is running on ${port}`));
