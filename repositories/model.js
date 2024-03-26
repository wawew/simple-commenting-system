import mongoose, { Types } from "mongoose";
import repoConnection from "./connection.js";

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  mbti: { type: String, required: true },
  enneagram: { type: String, required: true },
  variant: { type: String, required: true },
  tritype: { type: Number, required: true },
  socionics: { type: String, required: true },
  sloan: { type: String, required: true },
  psyche: { type: String, required: true },
  image: { type: String, required: true },
});
export const ProfileModel = mongoose.model("Profile", ProfileSchema);

const MBTIDetail = {
  INFP: "INFP",
  INFJ: "INFJ",
  ENFP: "ENFP",
  ENFH: "ENFH",
  INTJ: "INTJ",
  INTP: "INTP",
  ENTP: "ENTP",
  ENTJ: "ENTJ",
  ISFP: "ISFP",
  ISFJ: "ISFJ",
  ESFP: "ESFP",
  ESFJ: "ESFJ",
  ISTP: "ISTP",
  ISTJ: "ISTJ",
  ESTP: "ESTP",
  ESTJ: "ESTJ",
};
const EnneagramDetail = {
  "1w2": "1w2",
  "2w2": "2w2",
  "3w2": "3w2",
  "3w4": "3w4",
  "4w3": "4w3",
  "4w5": "4w5",
  "5w4": "5w4",
  "5w6": "5w6",
  "6w5": "6w5",
  "6w7": "6w7",
  "7w6": "7w6",
  "7w8": "7w8",
  "8w7": "8w7",
  "8w9": "8w9",
  "9w8": "9w8",
  "9w1": "9w1",
};
const ZodiacDetail = {
  Aries: "Aries",
  Taurus: "Taurus",
  Gemini: "Gemini",
  Cancer: "Cancer",
  Leo: "Leo",
  Virgo: "Virgo",
  Libra: "Libra",
  Scorpio: "Scorpio",
  Sagittarius: "Sagittarius",
  Capricon: "Capricon",
  Aquarius: "Aquarius",
  Pisces: "Pisces",
};
const PersonalityDetailMapping = {
  MBTI: Object.values(MBTIDetail),
  Enneagram: Object.values(EnneagramDetail),
  Zodiac: Object.values(ZodiacDetail),
};
const Personalities = {
  personality: {
    type: String,
    enum: Object.keys(PersonalityDetailMapping),
    required: true,
  },
  detail: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        const details = PersonalityDetailMapping[this.personality];
        return details && details.includes(v);
      },
      message: (props) => `Invalid detail for personality ${props.value}.`,
    },
  },
};

const CommentSchema = new mongoose.Schema({
  profileId: { type: Types.ObjectId, ref: "Profile", required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  personalities: { type: [Personalities] },
  votes: { upvotes: Number, voters: [Types.ObjectId] },
  createdBy: { _id: Types.ObjectId, name: String, image: String },
  createdAt: { type: Date, default: Date.now },
});
export const CommentModel = mongoose.model("Comment", CommentSchema);
