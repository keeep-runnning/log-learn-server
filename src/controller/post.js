import AppError from "../error/AppError.js";
import * as postRepository from "../repository/post.js";

function isPostAuthor(user, post) {
  if (!user || !post) {
    return false;
  }
  return user.id === post.authorId;
}

export async function createPost(req, res) {
  const { title, content } = req.body;
  const { id: authorId } = req.user;
  const newPost = await postRepository.create({ title, content, authorId });
  res.status(201).json({
    id: String(newPost.id),
    title: newPost.title,
    content: newPost.content,
    author: newPost.author.username,
    createdAt: newPost.createdAt,
  });
}

export async function getPostById(req, res) {
  const postId = Number(req.params.postId);
  const post = await postRepository.findById(postId);
  if (!post) {
    throw new AppError({
      message: "블로그 포스트가 없습니다",
      statusCode: 404,
    });
  }
  res.json({
    id: String(post.id),
    title: post.title,
    content: post.content,
    author: post.author.username,
    createdAt: post.createdAt,
  });
}

export async function updatePost(req, res) {
  const postId = Number(req.params.postId);
  const { title, content } = req.body;
  const post = await postRepository.findById(postId);
  if (!post) {
    throw new AppError({
      message: "블로그 포스트가 없습니다",
      statusCode: 404,
    });
  }
  if (!isPostAuthor(req.user, post)) {
    throw new AppError({
      message: "권한이 없습니다",
      statusCode: 403,
    });
  }
  await postRepository.update({ id: postId, title, content });
  res.status(204).json();
}

export async function getPostsByAuthorName(req, res) {
  const PAGE_SIZE = 10;
  let cursor = Number(req.query.cursor);
  if (Number.isNaN(cursor)) cursor = -1;
  const authorName = req.query.authorName ?? "";

  const posts = await postRepository.findPageByAuthorName({
    authorName,
    cursor,
    pageSize: PAGE_SIZE,
  });

  res.json({
    posts: posts.map((post) => ({
      id: String(post.id),
      author: post.author.username,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    })),
    nextCursor: posts.length === PAGE_SIZE ? String(posts[posts.length - 1].id) : null,
  });
}

export async function removePost(req, res) {
  const postId = Number(req.params.postId);
  const post = await postRepository.findById(postId);
  if (!post) {
    throw new AppError({
      message: "블로그 포스트가 없습니다",
      statusCode: 404,
    });
  }
  if (!isPostAuthor(req.user, post)) {
    throw new AppError({
      message: "권한이 없습니다",
      statusCode: 403,
    });
  }
  await postRepository.remove(postId);
  res.status(204).json();
}
