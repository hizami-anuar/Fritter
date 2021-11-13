const express = require('express');

const Users = require('../models/User');
const Freets = require('../models/Freet');

const validateThat = require('./middleware');

const router = express.Router();

/**
 * Get all usernames.
 */
router.get('/', (req, res) => {
  const users = Users.findAll().map((user) => user.username);
  res.status(200).json(users).end();
})

/**
 * Create a user.
 * 
 * @name POST /api/users
 * 
 * @param {string} username - name of user
 * @param {string} password - user's password
 * @return {User} - the created User
 * @throws {400} - if username is already taken
 */
router.post('/', 
    [
    validateThat.usernameDoesNotAlreadyExist, 
    validateThat.validUsername,
    validateThat.validPassword,
    ], 
    (req, res) => {
    const user = Users.addOne(req.body.username, req.body.password);
    req.session.username = user.username;
    req.session.userID = user.userID;
    const returnedUser = {username: user.username, userID: user.userID, following: user.following };
    res.status(200).json(returnedUser).end();
});

/**
 * Update a user's username.
 * 
 * @name PATCH /api/users/username
 * 
 * @param {string} username - the new username
 * @return {User} - the updated User
 * @throws {403} - if user is not logged in
 * @throws {400} - if username is not formatted correctly - ie there is whitespace or special characters
 */
router.patch('/username', 
    [
        validateThat.userIsLoggedIn,
        validateThat.validUsername,
        validateThat.usernameDoesNotAlreadyExist,
    ], 
(req, res) => {
    const username = req.body.username
    const user = Users.updateOneUsername(req.session.username, username);
    req.session.username = username;
    const returnedUser = {username: user.username, userID: user.userID, following: user.following };
    res.status(200).json(returnedUser).end();
});

/**
 * Update a user's password.
 * 
 * @name PATCH /api/users/password
 * 
 * @param {string} password - the new password
 * @return {User} - the updated User
 * @throws {403} - if user is not logged in
 * @throws {400} - if password is not formatted correctly - ie there is whitespace
 */
 router.patch('/password',
    [
        validateThat.userIsLoggedIn,
        validateThat.validPassword,
    ], 
(req, res) => {
    const user = Users.updateOnePassword(req.session.username, req.body.password);
    const returnedUser = {username: user.username, userID: user.userID, following: user.following };
    res.status(200).json(returnedUser).end();
  });

/**
 * Delete a user.
 * 
 * @name DELETE /api/users
 * 
 * @return {User} - the deleted user
 * @throws {404} - if user does not exist
 */
router.delete('/', [
    validateThat.userIsLoggedIn
  ], (req, res) => {
    const user = Users.deleteOne(req.session.username);
    Freets.deleteAllByUserID(user.userID);
    req.session.username = undefined;
    req.session.userID = undefined;
    res.status(200).json(user).end();
  });

/**
 * Get list of users that are following a user.
 * 
 * @name GET /api/users/:username/followers
 * 
 * @param {string} username- user
 * @return {User[]} - list of user's followers
 * @throws {404} - if non-existent user
 */
 router.get('/:username/followers',
    [

    ], 
  (req, res) => {
    const userID = Users.findOneUsername(req.params.username).userID;
    const followers = Users.getFollowers(userID);
    res.status(200).json(followers).end();
  });

  /**
 * Get list of users that a user is following
 * 
 * @name GET /api/users/:username/following
 * 
 * @param {string} username - user
 * @return {User[]} - list of user's followers
 * @throws {404} - if non-existent user
 */
 router.get('/:username/following',
 [

 ], 
(req, res) => {
 const following = Users.findOneUsername(req.params.username).following;
 res.status(200).json(following).end();
});

/**
 * Follow another user.
 * 
 * @name PATCH /api/users/:followingUserID/following
 * 
 * @param {number} followingUserID - user to follow
 * @return {User} - the User after following a new user
 * @throws {403} - if user is not logged in
 * @throws {404} - if trying to follow a non-existent user
 */
 router.patch('/:followingUserID/following',
    [
        validateThat.userIsLoggedIn,
        validateThat.followingUserIDExists,
    ], 
(req, res) => {
    const followingID = parseInt(req.params.followingUserID, 10);
    const user = Users.followOne(followingID, req.session.userID);
    const returnedUser = {username: user.username, userID: user.userID, following: user.following };
    res.status(200).json(returnedUser).end();
  });

/**
 * Unfollow another user.
 * 
 * @name DELETE /api/users/:followingUserID/following
 * 
 * @param {number} followingUserID - user to follow
 * @return {User} - the User after following a new user
 * @throws {403} - if user is not logged in
 * @throws {404} - if trying to follow a non-existent user
 */
 router.delete('/:followingUserID/following',
 [
     validateThat.userIsLoggedIn,
     validateThat.followingUserIDExists,
 ], 
(req, res) => {
 const followingID = parseInt(req.params.followingUserID, 10);
 const user = Users.unfollowOne(followingID, req.session.userID);
 const returnedUser = {username: user.username, userID: user.userID, following: user.following };
 res.status(200).json(returnedUser).end();
});

module.exports = router;