import mongoose from "mongoose";
import logger from "../utils/logger.js";

export default async function(config) {
  const url = config.url;
  try {
    await mongoose.connect(url);
    logger.info(`Connected to MongoDB at ${url.split('@')[1]}`);
  } catch(err){
    logger.error(`Failed to connect to MongoDB at ${url.split('@')[1]} \n${err}`);
  }
}
