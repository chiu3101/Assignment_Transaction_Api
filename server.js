const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const transactionRoutes = require("./models/Transaction");
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());
const cors = require("cors");
app.options("*", cors());

app.use(
  cors({
    origin: "http://localhost:5173", // Allow only Vite's localhost origin
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/transactions", transactionRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
