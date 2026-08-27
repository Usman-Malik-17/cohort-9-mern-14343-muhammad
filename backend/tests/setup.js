import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

export const mochaHooks = {
  async beforeAll() {
    try {
      await mongoose.connect(process.env.MONGO_URI_TEST);
      console.log("Test MongoDB connected");
    } catch (error) {
      console.error("Failed to connect to test database:", error.message);
      throw error;
    }
  },

  async afterAll() {
    try {
      await mongoose.connection.close();
      console.log("Test MongoDB disconnected");
    } catch (error) {
      console.error("Failed to disconnect from test database:", error.message);
      throw error;
    }
  },
};
