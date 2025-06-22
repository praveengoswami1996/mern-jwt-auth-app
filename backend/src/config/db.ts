import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log(`Successfully connected to MongoDB : ${connection.connection.host}`);
  } catch (error) {
    console.error("Could not connect to DB", error);
    process.exit(1);
  }
};
export default connectToDatabase;