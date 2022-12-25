import BusinessError from "../errors/BusinessError.js";
import * as postsRepository from "../repository/posts.js";

function isPostAuthor(user, post) {
  if (!user || !post) {
    return false;
  }
  return user.id === post.User.id;
}

export async function createPost(req, res, next) {
  const { title, content } = req.body;
  const { id: authorId } = req.user;
  try {
    const newPost = await postsRepository.create({ title, content, authorId });
    return res.status(201).json({
      id: String(newPost.id),
      title: newPost.title,
      content: newPost.content,
      author: newPost.User.username,
      createdAt: newPost.createdAt.toISOString(),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getPostById(req, res, next) {
  const { postId } = req.params;
  try {
    const post = await postsRepository.findById(postId);
    if (!post) {
      const postNotFoundError = new BusinessError({
        errorCode: "post-001",
        message: "블로그 포스트가 없습니다.",
        statusCode: 404,
      });
      return next(postNotFoundError);
    }
    return res.json({
      id: String(post.id),
      title: post.title,
      content: post.content,
      author: post.User.username,
      createdAt: post.createdAt.toISOString(),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function updatePost(req, res, next) {
  const { postId } = req.params;
  const { title, content } = req.body;
  try {
    const post = await postsRepository.findById(postId);
    if (!post) {
      const postNotFoundError = new BusinessError({
        message: "블로그 포스트가 없습니다.",
        statusCode: 404,
        errorCode: "post-001",
      });
      return next(postNotFoundError);
    }
    if (!isPostAuthor(req.user, post)) {
      const notAuthorizedError = new BusinessError({
        message: "권한이 없습니다.",
        statusCode: 403,
        errorCode: "common-003",
      });
      return next(notAuthorizedError);
    }
    await postsRepository.update({ id: postId, title, content });
    return res.status(204).json();
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getPostsByAuthorName(req, res, next) {
  const PAGE_SIZE = 10;
  const { cursor, authorName } = req.query;
  try {
    const posts = await postsRepository.findPageByAuthorName({
      authorName,
      cursor,
      pageSize: PAGE_SIZE,
    });
    return res.json({
      posts: posts.map((post) => ({
        id: String(post.id),
        author: post.User.username,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt.toISOString(),
      })),
      nextCursor: posts.length === PAGE_SIZE ? String(posts[posts.length - 1].id) : null,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function removePost(req, res, next) {
  const { postId } = req.params;
  try {
    const post = await postsRepository.findById(postId);
    if (!post) {
      const postNotFoundError = new BusinessError({
        message: "블로그 포스트가 없습니다.",
        statusCode: 404,
        errorCode: "post-001",
      });
      return next(postNotFoundError);
    }
    if (!isPostAuthor(req.user, post)) {
      const notAuthorizedError = new BusinessError({
        message: "권한이 없습니다.",
        statusCode: 403,
        errorCode: "common-003",
      });
      return next(notAuthorizedError);
    }
    await postsRepository.remove(postId);
    return res.status(204).json();
  } catch (error) {
    console.error(error);
    next(error);
  }
}
