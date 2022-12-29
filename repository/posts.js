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

export async function findPageByAuthorName({ authorName, cursor, pageSize }) {
  const isNotFirstPage = cursor !== -1;

  const filter = {
    take: pageSize,
    where: {
      author: {
        username: authorName,
      },
    },
    orderBy: {
      id: "desc",
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  };

  if (isNotFirstPage) {
    filter.skip = 1;
    filter.cursor = {
      id: cursor,
    };
  }

  return await db.post.findMany(filter);
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
