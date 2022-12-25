import { Op } from "sequelize";

import db from "../models/index.js";

export async function create({ title, content, authorId }) {
  const { id: postId } = await db.Post.create({
    title,
    content,
    UserId: authorId,
  });
  const newPost = await db.Post.findOne({
    where: { id: postId },
    include: {
      model: db.User,
      attributes: ["username"],
    },
  });

  return newPost;
}

export async function findById(id) {
  return await db.Post.findOne({
    where: { id },
    include: {
      model: db.User,
      attributes: ["id", "username"],
    },
  });
}

export async function findPageByAuthorName({ authorName = null, cursor = "-1", pageSize = 10 }) {
  const author = await db.User.findOne({
    where: { username: authorName },
  });
  const filter = {
    where: {
      UserId: author?.id ?? "-1",
    },
    include: [{ model: db.User, attributes: ["username"] }],
    order: [["id", "DESC"]],
    limit: pageSize,
  };
  if (cursor !== "-1") {
    filter.where.id = {
      [Op.lt]: cursor,
    };
  }
  return await db.Post.findAll(filter);
}

export async function update({ id, title, content }) {
  const post = await findById(id);
  await post.update({ title, content });
}

export async function remove(id) {
  const post = await findById(id);
  await post.destroy();
}
