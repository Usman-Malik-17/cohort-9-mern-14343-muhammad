import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

export const mochaHooks = {
  async beforeAll() {
    await mongoose.connect(process.env.MONGO_URI_TEST);
    console.log("Test MongoDB connected");
  },

  async afterAll() {
    await mongoose.connection.close();
    console.log("Test MongoDB disconnected");
  },
};
