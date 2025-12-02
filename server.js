import express from "express";
import dotenv from "dotenv";
import connectDb from "./utilis/db.js";
import cloudinary from "cloudinary";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
app.use(express.json());

const port = process.env.PORT;

// importing routes
import userRoutes from "./routes/user.js";

//using routes

app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server is runnning port http://localhost:${port}`);

  connectDb();
});
