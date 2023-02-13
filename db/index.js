import Mongoose from "mongoose";
import { mongo } from "../config/environment/index.js";

let isConnected;
let db;

const connectDB = async () => {
  if (isConnected) return db;

  try {
    Mongoose.set("strictQuery", false);
    db = await Mongoose.connect(mongo.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState;
    return db;
  } catch (err) {
    throw new Error(err);
  }
};

export default connectDB;
