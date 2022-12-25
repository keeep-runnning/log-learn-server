import db from "../models/index.js";

export async function findById(id) {
  return await db.User.findOne({ where: { id } });
}

export async function findByUsername(username) {
  return await db.User.findOne({ where: { username } });
}

export async function findByEmail(email) {
  return await db.User.findOne({ where: { email } });
}

export async function create({ username, email, password }) {
  await db.User.create({ username, email, password });
}

export async function updateUsername({ id, newUsername }) {
  const user = await findById(id);
  await user.update({ username: newUsername });
}

export async function updateShortIntroduction({ id, newShortIntroduction }) {
  const user = await findById(id);
  await user.update({ shortIntroduction: newShortIntroduction });
}

export async function updateIntroduction({ id, newIntroduction }) {
  const user = await findById(id);
  await user.update({ introduction: newIntroduction });
}

export async function updatePassword({ id, newPassword }) {
  const user = await findById(id);
  await user.update({ password: newPassword });
}
