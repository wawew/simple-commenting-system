import { ProfileModel } from "../repositories/model.js";

export async function authMiddleware(req, res, next) {
  const profileId = req.headers["x-profile-id"];
  if (!profileId) {
    return res.status(403).json({ message: "X-User-ID header is missing" });
  }

  const profile = await ProfileModel.findById(profileId).catch((err) => {
    if (err) {
      return res
        .status(403)
        .json({ code: "PERMISSION_DENIED", message: "Permission denied" });
    }
  });
  if (!profile) {
    return res
      .status(404)
      .json({ code: "PERMISSION_DENIED", message: "Permission denied" });
  }

  req.createdBy = profile;
  next();
}
