const Users = require('../models/User');
const Freets = require('../models/Freet');

// Checks that the username in the request body does not already exist
const usernameDoesNotAlreadyExist = (req, res, next) => {
  if (Users.findOneUsername(req.body.username) !== undefined) {
    res.status(400).json({
      error: `Username ${req.body.username} already exists.`,
    }).end();
    return;
  }
  next();
};

// Checks that the username is formatted properly
//  User is not empty
//  User contains no whitespace
const validUsername = (req, res, next) => {
  if (!req.body.username || req.body.username.length === 0) {
    res.status(400).json({
      error: `username cannot be empty string`,
    }).end();
    return;
  } else if (/\s/g.test(req.body.username)) {
    res.status(400).json({
      error: `username cannot contain whitespace.`,
    }).end();
    return;
  }
  next();
};

// Checks that the password is formatted properly
//  Password is not empty
//  Password contains no whitespace
const validPassword = (req, res, next) => {
  if (!req.body.password || req.body.password.length === 0) {
    res.status(400).json({
      error: `password cannot be empty string.`,
    }).end();
    return;
  } else if (/\s/g.test(req.body.username)) {
    res.status(400).json({
      error: `username cannot contain whitespace.`,
    }).end();
    return;
  }
  next();
};

// Checks that username/password correspond to a user
const validCredentials = (req, res, next) => {
  const user = Users.findOneUsername(req.body.username);
  if (user === undefined || !(user.password === req.body.password)) {
    res.status(403).json({
      error: `Username password combination not recognized.`,
    }).end();
    return;
  }
  next();
};

// Checks that the username in the parameters exists
const usernameExists = (req, res, next) => {
  if (Users.findOneUsername(req.params.username) === undefined) {
    res.status(404).json({
      error: `Username ${req.params.username} does not exist.`,
    }).end();
    return;
  }
  next()
};

// Checks that the username is set in session, i.e., user logged in
const userIsLoggedIn = (req, res, next) => {
  if (req.session.username == undefined) {
    res.status(403).json({
      error: 'You must be logged in in order to perform this action!'
    }).end();
    return;
  }
  next();
};

// Checks that the username is set in session, i.e., user logged in
const followingUserIDExists = (req, res, next) => {
  const id = parseInt(req.params.followingUserID, 10);
  if (Users.findOneUserID(id) === undefined) {
    res.status(404).json({
      error: `User with ID ${req.params.followingUserID} does not exist.`,
    }).end();
    return;
  }
  next();
};

// Checks that the username is set in session, i.e., user logged in
const userIsNotLoggedIn = (req, res, next) => {
  if (req.session.username != undefined) {
    res.status(400).json({
      error: 'You are already logged in!'
    }).end();
    return;
  }
  next();
};

// Checks that the freet is not empty and not more than 140 characters
const freetWithinLimits = (req, res, next) => {
    if (!req.body.content ||
        req.body.content.length === 0) {
        res.status(400).json({
            error: `Freet cannot be an empty string.`,
          }).end();
          return;
    } else if (req.body.content.trim().length === 0) {
      res.status(400).json({
        error: `Freet cannot be just spaces.`,
      }).end();
      return
    } else if (req.body.content.length > 140) {
        res.status(400).json({
            error: `Freets cannot be longer than 140 characters.`,
        }).end();
        return;
    }
    next();
};

// Check that there are no white spaces at the front or at the end of freet
const freetDoesNotHaveTrailingSpaces = (req, res, next) => {
  if (req.body.content.trim() !== req.body.content) {
    res.status(400).json({
      error: `Freet have `
    }).end();
    return;
  }
  next();
};

// Checks that user owns freet
const userOwnsFreet = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const freet = Freets.findOne(id);
  if (req.session.userID !== freet.userID) {
    res.status(403).json({
      error: `You do not have permission to edit or delete this freet.`,
    }).end();
    return;
  }
  next();
}

// Checks that freet ID is not empty
const freetIdIsValid = (req, res, next) => {
  if (req.params.id === undefined || req.params.id.length === 0) {
    res.status(400).json({
        error: `Freet ID is empty.`,
    }).end();
    return;
  }
  next();
}

// Checks that freet exists
const freetExists = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const freet = Freets.findOne(id);
  if (freet == null) {
    res.status(404).json({
      error: `Freet not found.`,
    }).end();
    return;
  }
  next();
}

// Checks that the username is not the empty string
const authorNotEmpty = (req, res, next) => {
  if (req.params.author.length === 0) {
    res.status(400).json({
      error: `Usernames must have non zero length.`,
    }).end();
    return;
  }
  next();
};

module.exports = Object.freeze({
  usernameDoesNotAlreadyExist,
  validUsername,
  validPassword,
  validCredentials,
  usernameExists,
  userIsLoggedIn,
  followingUserIDExists,
  userIsNotLoggedIn,
  freetWithinLimits,
  userOwnsFreet,
  freetIdIsValid,
  freetExists,
  authorNotEmpty,
});