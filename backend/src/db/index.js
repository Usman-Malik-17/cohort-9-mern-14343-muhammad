import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI);
    const mongoUri =
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI;

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};

export { connectDB };
