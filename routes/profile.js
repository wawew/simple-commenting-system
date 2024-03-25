"use strict";

import { Router } from "express";
import { ProfileService } from "../services/profile.js";
import { errorWrapper } from "./wrapper.js";

const router = Router();
const profileService = new ProfileService();

router.get(
  "/:id",
  errorWrapper(async (req, res, next) => {
    const profileId = req.params.id;
    const profile = await profileService.getProfile(profileId);
    res.render("profile_template", { profile: profile });
  }),
);

router.post(
  "/profile/create",
  errorWrapper(async (req, res, next) => {
    const profileId = await profileService.createProfile(req.body);
    res.status(201).json({ id: profileId });
  }),
);

export default router;
