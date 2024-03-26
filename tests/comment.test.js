import { CommentService } from "../services/comment.js";
import { CommentModel, ProfileModel } from "../repositories/model.js";
import { GenericError } from "../services/exception.js";

describe("CommentService", () => {
  let commentService;
  let testProfile1;
  let testProfile2;
  let commentId;

  beforeEach(async () => {
    commentService = new CommentService();

    // Create two profiles to use in the tests
    testProfile1 = await ProfileModel.create({
      name: "Test User 1",
      description: "This is a test profile.",
      mbti: "INTJ",
      enneagram: "9w3",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://example.com/test-image1.png",
    });
    testProfile2 = await ProfileModel.create({
      name: "Test User 2",
      description: "This is another test profile.",
      mbti: "ENTP",
      enneagram: "9w4",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://example.com/test-image2.png",
    });

    // Create a comment
    commentId = await commentService.createComment(
      {
        profileId: testProfile1.id,
        title: "Test Title",
        description: "Test Description",
        personalities: [{ personality: "MBTI", detail: "INTP" }],
      },
      testProfile2,
    );
  });

  afterEach(async () => {
    // Clean up the test database after tests
    await CommentModel.deleteMany({});
    await ProfileModel.deleteMany({});
  });

  test("createComment should throw an error if user tries to comment on their own profile", async () => {
    await expect(
      commentService.createComment(
        {
          profileId: testProfile1.id,
          title: "Test Title",
          description: "Test Description",
          personalities: [{ personality: "MBTI", detail: "INTP" }],
        },
        testProfile1,
      ),
    ).rejects.toThrow(GenericError);
  });

  test("createComment should create a comment successfully", async () => {
    await expect(
      commentService.createComment(
        {
          profileId: testProfile1.id,
          title: "Test Title",
          description: "Test Description",
          personalities: [{ personality: "MBTI", detail: "INTP" }],
        },
        testProfile2,
      ),
    ).resolves.not.toThrow();
  });

  test("getProfileComments should return comments for a given profile", async () => {
    const comments = await commentService.getProfileComments(
      {
        filter: {
          profileId: testProfile1.id,
        },
        sort: "newest",
        pagination: {
          take: 5,
          page: 1,
        },
      },
      testProfile2,
    );

    comments.data.forEach((comment) => {
      expect(comment).toHaveProperty("title");
      expect(comment).toHaveProperty("description");
      expect(comment).toHaveProperty("personalities");
    });
  });

  test("voteComment should correctly update hasVoted for the voter", async () => {
    await commentService.voteComment(commentId, testProfile1);

    const updatedComment = await commentService.getProfileComments(
      {
        filter: {
          profileId: testProfile1.id,
        },
        sort: "newest",
        pagination: {
          take: 5,
          page: 1,
        },
      },
      testProfile1,
    );

    const votedComment = updatedComment.data.find((c) => c.id === commentId);
    expect(votedComment.votes.upvotes).toBe(1); // Assuming the initial vote count is 0
    expect(votedComment.votes.hasVoted).toBe(true);
  });

  test("voteComment should throw an error if one votes on a their own comment", async () => {
    await await expect(
      commentService.voteComment(commentId, testProfile2),
    ).rejects.toThrow(GenericError);
  });
});
