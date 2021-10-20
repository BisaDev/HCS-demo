import mongoose from 'mongoose';
import isEmpty from 'lodash/isEmpty';

/**
 * Patient Schema
 */
const PatientSchema = new mongoose.Schema({
  "Program Identifier": {
    type: String,
    required: true
  },
  "Data Source": {
    type: String,
    required: false
  },
  "Card Number": {
    type: String,
    required: false
  },
  "Member ID": {
    type: String,
    required: false
  },
  "First Name": {
    type: String,
    required: false
  },
  "Last Name": {
    type: String,
    required: false
  },
  "Date of Birth": {
    type: Date,
    required: false
  },
  "Address 1": {
    type: String,
    required: false
  },
  "Address 2": {
    type: String,
    required: false
  },
  "City": {
    type: String,
    required: false
  },
  "Zip code": {
    type: String,
    required: false
  },
  "Telephone number": {
    type: String,
    required: false
  },
  "Email Address": {
    type: String,
    required: false
  },
  "CONSENT": {
    type: String,
    required: false
  },
  "Mobile Phone": {
    type: String,
    required: false
  },
});


/**
 * Methods
 */
PatientSchema.method({});

/**
 * Statics
 */
PatientSchema.statics = {
  /**
   * Get patient
   * @param {ObjectId} id - The objectId of patient.
   * @returns {Promise<Patient}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then(patient => {
        if (patient) {
          return patient;
        }
        return Promise.reject({ error: 'nope' });
      });
  },

  /**
   * List patients in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of patients to be skipped.
   * @param {number} limit - Limit number of patients to be returned.
   * @returns {Promise<Patient[]>}
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
   * @param {string} patientname
   * @param {string} mobileNumber
   * @returns {Boolean}
   */
  validatePatient({ email, password, confirmPassword, patientname, mobileNumber }) {
    let errors = {};
    !email && (errors.email = 'Email is required.');
    !password && (errors.password = 'Password is required.');
    !confirmPassword && (errors.password = 'Confirm password is required.');
    !errors.password &&
      !errors.confirmPassword &&
      password !== confirmPassword &&
      (errors.isPasswordMatch = "Password doesn't match.");
    !patientname && (errors.patientname = 'Patient name is required.');
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
   * @param {string} patientname
   * @param {string} email
   * @param {Date} createdAt
   * @returns {Object}
   */
  sanitizePatientData({ id, patientname, email, createdAt }) {
    return {
      id,
      patientname,
      email,
      createdAt
    };
  }
};

/**
 * @typedef Patient
 */
export default mongoose.model('Patient', PatientSchema);
