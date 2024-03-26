"use strict";

import { Router } from "express";
import { ProfileService } from "../services/profile.js";
import { errorWrapper } from "./wrapper.js";
import { CommentService } from "../services/comment.js";
import { authMiddleware } from "./middleware.js";

const router = Router();
const profileService = new ProfileService();
const commentService = new CommentService();

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

router.post(
  "/profile/comment/create",
  authMiddleware,
  errorWrapper(async (req, res, next) => {
    await commentService.createComment(req.body, req.createdBy);
    res.status(201).json({ message: "Success" });
  }),
);

router.get(
  "/profile/:profileId/comments",
  authMiddleware,
  errorWrapper(async (req, res, next) => {
    const { profileId } = req.params;
    const { filter, sort, pagination } = req.query;
    const result = await commentService.getProfileComments(
      {
        filter: {
          profileId: profileId,
          personality: filter?.personality,
        },
        sort: sort,
        pagination: {
          take: parseInt(pagination?.take) || 5,
          page: parseInt(pagination?.page) || 1,
        },
      },
      req.createdBy,
    );
    res.status(200).json(result);
  }),
);

router.post(
  "/profile/comment/:id/vote",
  authMiddleware,
  errorWrapper(async (req, res, next) => {
    await commentService.voteComment(req.params.id, req.createdBy);
    res.status(201).json({ message: "Success" });
  }),
);

export default router;
