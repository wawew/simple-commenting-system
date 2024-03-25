import { ProfileModel } from "../repositories/model.js";
import { EntityNotFoundError } from "./exception.js";

const createProfileSpec = {
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
};

export class ProfileService {
  /**
   * @param {String} profileId
   * @returns {ProfileModel}
   */
  async getProfile(profileId) {
    const profile = await ProfileModel.findById(profileId).catch((error) => {
      throw new EntityNotFoundError("Profile is not found");
    });
    if (!profile) {
      throw new EntityNotFoundError("Profile is not found");
    }
    return profile;
  }

  /**
   * @param {createProfileSpec} spec
   * @returns {String}
   */
  async createProfile(spec) {
    const profile = await ProfileModel.create(spec);
    return profile.id;
  }
}
