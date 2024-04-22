import { errorHandler } from "../utilis/error.js";
import Post from "../models/post.model.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savePost = await newPost.save();
    res.status(201).json(savePost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    // Extract query parameter for startIndex or set default value to 0
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Extract query parameter for limit or set default value to 9
    const limit = parseInt(req.query.limit) || 9;

    // Determine sorting direction based on query parameter, default to descending order
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Construct the query object based on available query parameters
    const query = {};

    // Include userId in the query if provided
    if (req.query.userId) query.userId = req.query.userId;

    // Include category in the query if provided
    if (req.query.category) query.category = req.query.category;

    // Include slug in the query if provided
    if (req.query.slug) query.slug = req.query.slug;

    // Include postId in the query if provided
    if (req.query.postId) query._id = req.query.postId;

    // Include searchTerm in the query if provided
    if (req.query.searchTerm) {
      // Include search term in the query for title or content
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    // Fetch posts based on the constructed query
    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection }) // Sort posts by updatedAt field
      .skip(startIndex) // Skip the specified number of documents
      .limit(limit); // Limit the number of documents returned

    // Get the total count of posts in the database
    const totalPosts = await Post.countDocuments();

    // Get the count of posts created in the last month
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Send response with posts, total post count, and count of last month's posts
    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};
