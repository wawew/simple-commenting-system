import { ProfileService } from "../services/profile.js";
import { ProfileModel } from "../repositories/model.js";

describe("ProfileService", () => {
  let profileService;

  beforeAll(async () => {
    profileService = new ProfileService();
  });

  afterAll(async () => {
    // Clean up the test database after tests
    await ProfileModel.deleteMany({});
  });

  test("createProfile and getProfile should match", async () => {
    const newProfile = {
      name: "Test User",
      description: "This is a test profile.",
      mbti: "INTJ",
      enneagram: "9w3",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://example.com/test-image.png",
    };

    // Create a new profile
    const createdProfileId = await profileService.createProfile(newProfile);

    // Retrieve the created profile
    const retrievedProfile = await profileService.getProfile(createdProfileId);

    // Check if the created profile matches the retrieved profile
    expect(retrievedProfile.name).toBe(newProfile.name);
    expect(retrievedProfile.description).toBe(newProfile.description);
    expect(retrievedProfile.mbti).toBe(newProfile.mbti);
    expect(retrievedProfile.enneagram).toBe(newProfile.enneagram);
    expect(retrievedProfile.variant).toBe(newProfile.variant);
    expect(retrievedProfile.tritype).toBe(newProfile.tritype);
    expect(retrievedProfile.socionics).toBe(newProfile.socionics);
    expect(retrievedProfile.sloan).toBe(newProfile.sloan);
    expect(retrievedProfile.psyche).toBe(newProfile.psyche);
    expect(retrievedProfile.image).toBe(newProfile.image);
  });
});
