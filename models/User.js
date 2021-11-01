let data = [];
let nextUserID = 1;

/**
 * @typedef User
 * @prop {string} username - username, unique to the user, string with length > 0
 * @prop {string} password - any password with length > 0
 * @prop {number} userID - a unique ID that is immutable
 * @prop {number[]} following - list of users this user is currently following
 */

/**
 * @class User
 * 
 * Stores all Users. Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class User {
  /**
   * Add a User to the collection.
   * 
   * @param {string} username - username, unique to the user, string with length > 0
   * @param {string} password - any password with length > 0
   * @return {User} - the newly created user
   */
  static addOne(username, password) {
    const user = { username, password, "userID": nextUserID, "following": [] };
    nextUserID++;
    data.push(user);
    return user;
  }

  /**
   * Find a User by username.
   * 
   * @param {string} username - The username of the user to find
   * @return {User | undefined} - the found user with above name
   */
  static findOneUsername(username) {
    return data.filter(user => user.username === username)[0];
  }

  /**
   * Find a User by user ID.
   * 
   * @param {number} userID - The userID of the user to find
   * @return {User | undefined} - the found user with above userID
   */
   static findOneUserID(userID) {
    return data.filter(user => user.userID === userID)[0];
  }

  /**
   * @return {User[]} an array of all of the Users
   */
  static findAll() {
    return data;
  }

  /**
   * Update a User's username.
   * 
   * @param {string} oldUsername - The old username of the user to update
   * @param {string} newUsername - The new username of the user
   * @return {User | undefined} - The updated user
   */
  static updateOneUsername(oldUsername, newUsername) {
    const user = User.findOneUsername(oldUsername);
    user.username = newUsername;
    return user;
  }

  /**
   * Update a User's password.
   * 
   * @param {string} username - The username of the User to update
   * @param {string} newPassword - The new password to associate with the User
   * @return {User | undefined} - The updated User
   */
   static updateOnePassword(username, newPassword) {
    const user = User.findOneUsername(username);
    user.password = newPassword;
    return user;
  }

  /**
   * Delete a User from the collection.
   * 
   * @param {string} username - name of User to delete
   * @return {User | undefined} - deleted User
   */
  static deleteOne(username) {
    const user = User.findOneUsername(username);
    data = data.filter(u => u.username !== username);
    return user;
  }

  /**
   * Follow a User.
   * 
   * @param {number} userID - id of user to follow
   * @param {number} followingUserID - id of user following another user
   * @return {User | undefined} - user that added a user to follow
   */
   static followOne(userID, followingUserID) {
    const user = User.findOneUserID(userID);
    const followingUser = User.findOneUserID(followingUserID);
    if (user && followingUser && !followingUser.following.includes(user.userID)){
      followingUser.following.push(user.userID);
    }
    return followingUser;
  }

  /**
   * Unfollow a User.
   * 
   * @param {number} userID - id of user to unfollow
   * @param {number} followingUserID - id of user unfollowing another user
   * @return {User | undefined} - user that a removed a user to follow
   */
   static unfollowOne(userID, unfollowingUserID) {
    const user = User.findOneUserID(userID);
    const unfollowingUser = User.findOneUserID(unfollowingUserID);
    if (user && unfollowingUser && unfollowingUser.following.includes(user.userID)){
      unfollowingUser.following = unfollowingUser.following.filter(u => u !== user.userID);
    }
    return unfollowingUser;
  }
}

module.exports = User;