const express = require('express');

const Freets = require('../models/Freet');
const Users = require('../models/User');

const validateThat = require('./middleware');

const router = express.Router();

/**
 * List all freets.
 * 
 * @name GET /api/freets
 * 
 * @return {Freet[]} - list of all stored freets
 */
router.get('/', (req, res) => {
  let freets = [];
  if (req.query.id) {
    freets = Freets.findOne(req.query.id, complex=true);
  } else if (req.query.author) {
    const author = Users.findOneUsername(req.query.author);
    if (author) {
      freets = Freets.findAllByUserID(author.userID, complex=true);
    } else {
      freets = [];
    }
  } else {
    freets = Freets.findAll(complex=true);
  }
  const sort = req.query.sort;
  freets = freets.reverse();
  if (sort == "popular") {
    freets.sort(function(a, b){return b.likes.length - a.likes.length});
  }
  res.status(200).json(freets).end();
});

/**
 * Get refreet chain of a freet
 */
router.get('/:id/children', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let freet = Freets.getChildren(id);
  res.status(200).json(freet).end();
})

/**
 * Create a freet.
 * 
 * @name POST /api/freets
 * 
 * @param {string} content - content of freet
 * @return {Freet} - the created freet
 * @throws {400} - if freet is empty string or longer than 140 chars
 */
router.post('/',
    [
        validateThat.userIsLoggedIn,
        validateThat.freetWithinLimits
    ],
(req, res) => {
    const freet = Freets.addOne(req.body.content, req.session.userID, req.body.refreet); 
    res.status(200).json(freet).end();
  });
 
/**
 * Get a freet by ID
 * 
 * @name GET /api/freets/:id
 * 
 * @param {string} content - content of freet
 * @param {number} freetID - ID of the freet
 * @return {Freet} - the created Freet
 * @throws {400} - if freet ID is improperly formatted
 * @throws {404} - if freet with freetID cannot be found
 */
router.get('/:id',
  [
    validateThat.freetIdIsValid,
    validateThat.freetExists,
  ],
  (req, res) => {
    const id = parseInt(req.params.id, 10);
    result = [Freets.findOne(id, complex=true)];
    res.status(200).json(result).end();
  });

/**
 * Edit a freet.
 * 
 * @name PUT /api/freets/:id
 * 
 * @param {string} content - content of freet
 * @param {number} freetID - ID of the freet
 * @return {Freet} - the created Freet
 * @throws {400} - if freet ID or freet is improperly formatted
 * @throws {403} - if user is not logged in or does not have permission to edit freet
 * @throws {404} - if freet with freetID cannot be found
 */
router.put('/:id',
  [
    validateThat.userIsLoggedIn,
    validateThat.freetWithinLimits,
    validateThat.freetIdIsValid,
    validateThat.freetExists,
    validateThat.userOwnsFreet,
  ],
  (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updatedFreet = Freets.updateOne(id, req.body.content);
    res.status(200).json(updatedFreet).end();
  });

/**
 * Delete a freet.
 * 
 * @name DELETE /api/freets/:id?
 * 
 * @param {number} freetID - ID of the freet
 * @return {Freet} - the deleted Freet
 * @throws {400} - if freet ID is improperly formatted
 * @throws {403} - if user is not logged in or does not have permission to edit freet
 * @throws {404} - if freet with freetID cannot be found
 */
router.delete('/:id?',
  [
    validateThat.userIsLoggedIn,
    validateThat.freetIdIsValid,
    validateThat.freetExists,
    validateThat.userOwnsFreet,
  ], (req, res) => {
    const id = parseInt(req.params.id, 10);
    const deletedFreet = Freets.deleteOne(id); 
    res.status(200).json(deletedFreet).end();
  });

/**
 * Get list of freets by following.
 * 
 * @name GET /api/freets/:username/following
 * 
 * @return {Freet[]} - list of freets followed by the logged in user
 * @throws {403} - if user not logged in
 */
 router.get('/:username/following', [
  validateThat.userIsLoggedIn,
], (req, res) => {
  const user = Users.findOneUserID(req.session.userID);
  console.log("user")
  console.log(user)
  const freets = Freets.findAllByManyUserIDs(user.following, complex=true);
  res.status(200).json(freets).end();
});

/**
 * Like a freet.
 * 
 * @name PATCH /api/freets/:id/likes
 * 
 * @param {userID} userID - content of freet
 * @param {number} id - ID of the freet
 * @return {Freet} - the updated Freet
 * @throws {400} - if freet ID is improperly formatted
 * @throws {403} - if user is not logged in
 * @throws {404} - if freet with freetID cannot be found
 */
router.patch('/:id/likes',
[
  validateThat.userIsLoggedIn,
  validateThat.freetIdIsValid,
  validateThat.freetExists,
],
(req, res) => {
  const id = parseInt(req.params.id, 10);
  const likedFreet = Freets.likeOne(id, req.session.userID);
  res.status(200).json(likedFreet).end();
});

/**
 * Unlike a freet.
 * 
 * @name DELETE /api/freets/:id/likes
 * 
 * @param {userID} userID - content of freet
 * @param {number} id - ID of the freet
 * @return {Freet} - the updated Freet
 * @throws {400} - if freet ID is improperly formatted
 * @throws {403} - if user is not logged in
 * @throws {404} - if freet with freetID cannot be found
 */
 router.delete('/:id/likes',
 [
   validateThat.userIsLoggedIn,
   validateThat.freetIdIsValid,
   validateThat.freetExists,
 ],
 (req, res) => {
   const id = parseInt(req.params.id, 10);
   const unlikedFreet = Freets.unlikeOne(id, req.session.userID);
   res.status(200).json(unlikedFreet).end();
 });

module.exports = router;