import AppError from "../error/AppError.js";
import * as postRepository from "../repository/post.js";

function isPostAuthor(user, post) {
  if (!user || !post) {
    return false;
  }
  return user.id === post.authorId;
}

export async function createPost(req, res) {
  const { id: userId } = req.user;
  const { title, content } = req.body;

  const newPost = await postRepository.create({ title, content, authorId: userId });

  res.status(201).json({
    id: newPost.id,
    title: newPost.title,
    content: newPost.content,
    createdAt: newPost.createdAt,
    authorId: newPost.authorId,
    authorName: newPost.author.username,
  });
}

export async function getPostById(req, res) {
  const { postId } = req.params;

  const post = await postRepository.findById(postId);

  if (!post) {
    throw new AppError({
      message: "블로그 포스트가 없습니다",
      statusCode: 404,
    });
  }

  res.json({
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    authorId: post.authorId,
    authorName: post.author.username,
  });
}

export async function updatePost(req, res) {
  const { postId } = req.params;
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

  const updatedPost = await postRepository.update({ id: postId, title, content });

  res.json({
    id: updatedPost.id,
    title: updatedPost.title,
    content: updatedPost.content,
    createdAt: updatedPost.createdAt,
    authorId: updatedPost.authorId,
    authorName: updatedPost.author.username,
  });
}

export async function getPostsByAuthorName(req, res) {
  const PAGE_SIZE = 10;

  const { authorName, cursor } = req.query;

  const posts = await postRepository.findPageByAuthorName({
    authorName,
    cursor,
    pageSize: PAGE_SIZE,
  });

  res.json({
    posts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      createdAt: post.createdAt,
      authorId: post.authorId,
      authorName: post.author.username,
    })),
    nextCursor: posts.length === PAGE_SIZE ? String(posts[posts.length - 1].id) : null,
  });
}

export async function removePost(req, res) {
  const { postId } = req.params;

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

  res.sendStatus(204);
}
