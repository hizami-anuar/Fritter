let data = [];
let nextFreetID = 1;
const Users = require('../models/User');

/**
 * @typedef Freet
 * @prop {string} content - text of the freet, with length > 0 and <= 140
 * @prop {number} userID - unique ID of the user who wrote this freet
 * @prop {number} freetID - a unique ID that is immutable
 * @prop {boolean} edited - a boolean to denote whether the post has been edited or not.
 * @prop {number[]} likes - a list of user IDs of users who have liked this freet.
 * @prop {Freet} refreet - optional property, freet that is refreeted by this freet
 * @prop {number[]} refreetedBy - a list of freets that have refreeted this freet
 */

/**
 * @class Freet
 * 
 * Stores all Freets. Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Freet {
  /**
   * Add a Freet to the collection.
   * 
   * @param {string} content - text of the freet, with length > 0 and <= 140
   * @param {number} userID - unique ID of the user who wrote this freet
   * @return {User} - the newly created user
   */
  static addOne(content, userID, refreet=undefined) {
    const edited = false;
    const freet = { "content": content, "freetID": nextFreetID, "userID": userID, edited, "likes": [], refreet: refreet, refreetedBy: [] };
    nextFreetID++;
    if (freet.refreet) {
      let refreet = Freet.findOne(freet.refreet);
      if (refreet) {
        refreet.refreetedBy.push(freet.freetID);
      }
    } 
    data.push(freet);
    return freet;
  }

  /**
   * Get the refreet children of a freet recursively
   * @param {number} freetID - ID of freet 
   * @return {Freet} - refreet children chain
   */
  static getChildren(freetID) {
    let freet = this.findOneWithAuthor(freetID);
    if (freet == undefined) {
      return "deleted";
    }
    freet.children = [];
    for (let refreet of freet.refreetedBy) {
      freet.children.push(Freet.getChildren(refreet));
    }
    return freet
  }

  /**
   * Given a Freet, get its refreet and author
   * @param {Freet} freet - freet object
   * @returns {Freet} - copy of freet with refreet and author
   */
  static parseRefreet(freet) {
    let result = Object.assign({}, freet);
    if (freet.refreet) {
      result.refreet = Freet.findOneWithAuthor(freet.refreet) || "deleted";
    } else {
      freet.refreet = undefined;
    }
    result.author = Users.findOneUserID(freet.userID).username;
    return result;
  }

  /**
   * Given a Freet, return a copy with its author
   * @param {Freet} freet
   * @returns {Freet}
   */
  static parseAuthor(freet) {
    let result = Object.assign({}, freet);
    result.author = Users.findOneUserID(freet.userID).username;
    return result;
  }

  /**
   * Find a Freet by ID.
   * 
   * @param {number} freetID - The unique ID of the Freet to find
   * @return {Freet | undefined} - the found Freet with above ID
   */
   static findOne(freetID) {
    let freet = data.filter(freet => freet.freetID === freetID)[0];
    return freet;
  }

  /**
   * Find a Freet by ID and return with Author.
   * 
   * @param {number} freetID - The unique ID of the Freet to find
   * @return {Freet | undefined} - the found Freet with above ID including refreet and author
   */
  static findOneWithAuthor(freetID) {
    let freet = Freet.findOne(freetID);
    if (freet === undefined) {
      return freet;
    }
    return this.parseRefreet(freet);
  }

  /**
   * Find all Freets by user ID 
   * 
   * @param {number} userID - The userID of the user whose freets to find
   * @return {Freet[]} - an array of all the Freets written by a user
   */
   static findAllByUserID(userID) {
    return data.filter(freet => freet.userID === userID);
  }

  /** Find all Freets by user ID and return with Author
   * 
   * @param {number} userID - The userID of the user whose freets to find
   * @return {Freet[]} - an array of all the Freets written by a user including refreet and author
   */
   static findAllByUserIDWithAuthor(userID) {
    return Freet.findAllByUserID(userID).map((freet) => this.parseRefreet(freet));
  }

  /**
   * Find all Freets by list of user IDs.
   * 
   * @param {number[]} userIDs - The userIDs of the users whose freets to find
   * @return {Freet[]} - an array of all the Freets written by these users
   */
   static findAllByManyUserIDs(userIDs) {
    return data.filter(freet => userIDs.includes(freet.userID));
   }

  /** Find all Freets by list of user IDs and parse out refreet and author
   * 
   * @param {number} userID - The userID of the user whose freets to find
   * @return {Freet[]} - an array of all the Freets written by these users including refreet and author
   */
   static findAllByManyUserIDsWithAuthor(userIDs) {
    return Freet.findAllByManyUserIDs(userIDs).map((freet) => this.parseRefreet(freet));
  }

  /**
   * @return {Freet[]} an array of all of the Freets
   */
  static findAll() {
    return data;
  }

  /**
   * @return {Freet[]} an array of all of the Freets including refreet and author
   */
   static findAllWithAuthor() {
    return Freet.findAll().map((freet) => this.parseRefreet(freet));
  }

  /**
   * Update a Freet's content.
   * 
   * @param {number} freetID - The ID of the freet you want to update
   * @param {string} newContent - The new content of the freet
   * @return {Freet | undefined} - The updated Freet
   */
  static updateOne(freetID, newContent) {
    const freet = Freet.findOne(freetID);
    freet.content = newContent;
    freet.edited = true;
    return freet;
  }

  /**
   * Delete a Freet from the collection.
   * 
   * @param {number} freetID - ID of Freet to delete
   * @return {Freet | undefined} - deleted Freet
   */
  static deleteOne(freetID) {
    const freet = Freet.findOne(freetID);
    data = data.filter(f => f.freetID !== freetID);
    return freet;
  }

  /**
   * Delete all Freets by an author from the collection.
   * 
   * @param {number} userID - ID of user's freets to delete
   * @return {Freet[]} - deleted Freets
   */
   static deleteAllByUserID(userID) {
    const authorMatch = Freet.findAllByUserID(userID);
    data = data.filter(f => f.userID !== userID);
    return authorMatch;
  }

  /**
   * Like a Freet.
   * 
   * @param {number} freetID - id of the freet that a user is liking
   * @param {number} userID - unique ID of the user who is upvoting this freet
   * @return {Freet | undefined} - freet that was liked
   */
   static likeOne(freetID, userID) {
    const freet = Freet.findOne(freetID);
    if (freet && !freet.likes.includes(userID)) {
      freet.likes.push(userID);
    }
    return freet;
  }

  /**
   * Remove a like from a Freet.
   * 
   * @param {number} freetID - id of the freet that a user is liking
   * @param {number} userID - unique ID of the user who is upvoting this freet
   * @return {Freet | undefined} - freet that was liked
   */
   static unlikeOne(freetID, userID) {
    const freet = Freet.findOne(freetID);
    if (freet && freet.likes.includes(userID)) {
      freet.likes = freet.likes.filter(u => u !== userID);
    }
    return freet;
  }
}

module.exports = Freet;