import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "Ecommerce2025",
    });
    console.log("DB connected succesfully !");
  } catch (err) {
    console.log(err);
  }
};

export default connectDb;
