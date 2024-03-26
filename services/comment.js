import { CommentModel, ProfileModel } from "../repositories/model.js";
import { EntityNotFoundError, GenericError } from "./exception.js";

const createCommentSpec = {
  profileId: String,
  title: String,
  desciption: String,
  personalities: [{ personality: String, detail: String }],
};

const getProfileCommentsSpec = {
  filter: {
    profileId: String,
    personality: "MBTI" | "Enneagram" | "Zodiac" | null | undefined,
  },
  sort: "newest" | "bestVotes",
  pagination: {
    take: Number,
    page: Number,
  },
};

const getProfileCommentResult = {
  page: Number,
  take: Number,
  totalPages: Number,
  totalData: Number,
  data: [
    {
      id: String,
      title: String,
      desciption: String,
      personalities: [{ personality: String, detail: String }],
      votes: { upvotes: Number, hasVoted: Boolean },
      createdBy: { id: String, name: String, image: String },
      createdAt: Date,
    },
  ],
};

export class CommentService {
  /**
   * @param {createCommentSpec} spec
   * @param {ProfileModel} createdBy
   * @returns {null}
   */
  async createComment(spec, createdBy) {
    const mainProfile = await this.#getProfile(spec.profileId);
    if (mainProfile.id === createdBy.id) {
      throw new GenericError("You can't post a comment to your own profile");
    }

    const comment = await CommentModel.create({
      profileId: spec.profileId,
      createdBy: {
        _id: createdBy._id,
        name: createdBy.name,
        image: createdBy.image,
      },
      title: spec.title,
      description: spec.description,
      tags: spec.tags,
      votes: { upvotes: 0, voters: [] },
      personalities: spec.personalities,
    }).catch((error) => {
      throw new GenericError(error.message);
    });
  }

  /**
   * @param {getProfileCommentsSpec} spec
   * @param {ProfileModel} getBy
   * @returns {getProfileCommentResult}
   */
  async getProfileComments(spec, getBy) {
    let query = { profileId: spec.filter.profileId };
    if (spec.filter.personality) {
      query["personalities.personality"] = spec.filter.personality;
    }

    let sort = {};
    if (spec.sort === "newest") {
      sort = { createdAt: -1 };
    } else if (spec.sort === "bestVotes") {
      sort = { "votes.upvotes": -1 };
    }

    const totalComments = await CommentModel.countDocuments(query);
    const totalPages = Math.ceil(totalComments / spec.pagination.take) || 1;
    const adjustedPage = Math.min(
      Math.max(spec.pagination.page, 1),
      totalPages,
    );

    const comments = await CommentModel.find(query)
      .sort(sort)
      .skip((adjustedPage - 1) * spec.pagination.take)
      .limit(spec.pagination.take);

    const mappedComments = comments.map((comment) => ({
      id: comment._id,
      title: comment.title,
      description: comment.description,
      personalities: comment.personalities,
      votes: {
        upvotes: comment.votes.upvotes,
        hasVoted: comment.votes.voters.includes(getBy.id),
      },
      createdBy: comment.createdBy,
      createdAt: comment.createdAt,
    }));

    return {
      page: spec.pagination.page,
      take: spec.pagination.take,
      totalPages,
      totalData: totalComments,
      data: mappedComments,
    };
  }

  /**
   * @param {String} commentId
   * @param {ProfileModel} votedBy
   */
  async voteComment(commentId, votedBy) {
    const comment = await this.#getComment(commentId);
    if (comment.createdBy._id.toString() === votedBy.id) {
      throw new GenericError("You cannot upvote your own comment");
    }

    let update = {};
    const hasVoted = comment.votes.voters.includes(votedBy.id);

    if (hasVoted) {
      update = {
        "votes.upvotes": comment.votes.upvotes - 1,
        $pull: { "votes.voters": votedBy._id },
      };
    } else {
      update = {
        "votes.upvotes": comment.votes.upvotes + 1,
        $push: { "votes.voters": votedBy._id },
      };
    }

    const updated = await CommentModel.updateOne({ _id: commentId }, update);
  }

  async #getProfile(profileId) {
    const profile = await ProfileModel.findById(profileId).catch((error) => {
      throw new EntityNotFoundError("Profile is not found");
    });
    if (!profile) {
      throw new EntityNotFoundError("Profile is not found");
    }
    return profile;
  }

  async #getComment(commentId) {
    const comment = await CommentModel.findById(commentId).catch((error) => {
      throw new EntityNotFoundError("Comment is not found");
    });
    if (!comment) {
      throw new EntityNotFoundError("Comment is not found");
    }
    return comment;
  }
}
