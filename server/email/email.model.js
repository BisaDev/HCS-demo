import mongoose from 'mongoose';
import isEmpty from 'lodash/isEmpty';

/**
 * Email Schema
 */
const EmailSchema = new mongoose.Schema({
  "locator": {
    type: String,
    required: false
  },
  "name": {
    type: String,
    required: true
  },
  "scheduled_date": {
    type: Date,
    required: false
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
EmailSchema.method({});

/**
 * Statics
 */
EmailSchema.statics = {

  /**
   * List emails in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of emails to be skipped.
   * @param {number} limit - Limit number of emails to be returned.
   * @returns {Promise<Email[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * @param {string} email
   * @param {string} password
   * @param {string} confirmPassword
   * @param {string} emailname
   * @param {string} mobileNumber
   * @returns {Boolean}
   */
  validateEmail({ email, password, confirmPassword, emailname, mobileNumber }) {
    let errors = {};
    !email && (errors.email = 'Email is required.');
    !password && (errors.password = 'Password is required.');
    !confirmPassword && (errors.password = 'Confirm password is required.');
    !errors.password &&
      !errors.confirmPassword &&
      password !== confirmPassword &&
      (errors.isPasswordMatch = "Password doesn't match.");
    !emailname && (errors.emailname = 'Email name is required.');
    !mobileNumber && (errors.mobileNumber = 'Mobile number is required.');
    //If valid return false
    if (isEmpty(errors)) return { valid: true, errors: null };
    //If errors
    return { valid: false, errors };
  },
  /**
   * @param {ObjectId} id
   * @param {string} emailname
   * @param {string} email
   * @param {Date} createdAt
   * @returns {Object}
   */
  sanitizeEmailData({ id, emailname, email, createdAt }) {
    return {
      id,
      emailname,
      email,
      createdAt
    };
  }
};

/**
 * @typedef Email
 */
export default mongoose.model('Email', EmailSchema);
