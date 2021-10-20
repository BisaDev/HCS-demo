import mongoose from 'mongoose';
import isEmpty from 'lodash/isEmpty';

/**
 * Email Schema
 */
const EmailSchema = new mongoose.Schema({
  emailname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [
      /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    ]
  },
  password: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
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
   * Get email
   * @param {ObjectId} id - The objectId of email.
   * @returns {Promise<Email}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then(email => {
        if (email) {
          return email;
        }
        return Promise.reject({ error: 'nope' });
      });
  },

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
   * @param {string} email
   * @param {string} password
   * @returns {Boolean}
   */
  validateLoginData({ email, password }) {
    let errors = {};
    !email && (errors.email = 'Email is required.');
    !password && (errors.password = 'Password is required.');
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
