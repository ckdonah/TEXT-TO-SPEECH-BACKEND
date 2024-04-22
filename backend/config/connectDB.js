import mongoose from "mongoose";
import colors from "colors";

const { MONGODB_URI } = process.env;

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(MONGODB_URI);
      console.log(`:::`.green,`MongoDB connected.`.yellow.bold);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  };

export default connectDB;
