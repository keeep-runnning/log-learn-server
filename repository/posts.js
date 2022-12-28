/* eslint-disable no-unused-vars */
import db from "../db.js";

export async function create({ title, content, authorId }) {
  return await db.post.create({
    data: {
      title,
      content,
      authorId,
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });
}

export async function findById(id) {
  return await db.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });
}

export async function findPageByAuthorName({ authorName = null, cursor = "-1", pageSize = 10 }) {
  // const author = await db.User.findOne({
  //   where: { username: authorName },
  // });
  // const filter = {
  //   where: {
  //     UserId: author?.id ?? "-1",
  //   },
  //   include: [{ model: db.User, attributes: ["username"] }],
  //   order: [["id", "DESC"]],
  //   limit: pageSize,
  // };
  // if (cursor !== "-1") {
  //   filter.where.id = {
  //     [Op.lt]: cursor,
  //   };
  // }
  // return await db.Post.findAll(filter);
  return [];
}

export async function update({ id, title, content }) {
  await db.post.update({
    where: { id },
    data: { title, content },
  });
}

export async function remove(id) {
  await db.post.delete({
    where: { id },
  });
}
