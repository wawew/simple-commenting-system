import mongoose from "mongoose";
import repoConnection from "./connection.js";

const ProfileSchema = new mongoose.Schema({
  name: String,
  description: String,
  mbti: String,
  enneagram: String,
  variant: String,
  tritype: Number,
  socionics: String,
  sloan: String,
  psyche: String,
  image: String,
});
export const ProfileModel = mongoose.model("Profile", ProfileSchema);
