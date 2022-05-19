function isPostAuthor(user, post) {
  if(!user || !post) {
    return false;
  }
  return user.id === post.User.id;
}

module.exports = { isPostAuthor };
