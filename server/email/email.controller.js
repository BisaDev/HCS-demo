import Email from './email.model';
import bcrypt from 'bcryptjs';
import { APIsuccess, APIerror } from '../helpers/API-responses';

// Get Email by ID
export const getEmailByIdController = async (req, res) => {
  try {
    // Get emailId
    const { emailId } = req.params;
    if (!emailId) return res.status(400).json(APIerror(400, { emailId: 'Email ID is undefined.' }));

    // Find email by id
    const email = await Email.get(emailId);

    // No email
    if (!email)
      return res
        .status(404)
        .json(APIerror(404, { email: `Email with ID: ${emailId} doesn't exists.` }));

    // Email exists
    return res.status(200).json(APIsuccess(200, Email.sanitizeEmailData(email)));
  } catch (err) {
    // Some server error
    return res.status(500).json(APIerror(500, { err }));
  }
};

// Create new email
export const createEmailController = async (req, res) => {
  try {
    // Validate email data
    const { valid, errors } = await Email.validateEmail(req.body);
    if (!valid) return res.status(400).json(APIerror(400, { errors }));

    // Get email data
    const {
      email,
      password,
      //confirmPassword,
      mobileNumber,
      emailname
    } = req.body;

    // Check if email with provided email exists in db
    const isEmailInDb = await Email.findOne({ email });
    if (isEmailInDb) return res.status(400).json(APIerror(400, { existInDb: true }));

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); //await bcrypt.compare(password, email.password <-- hashed)

    // Create new email
    const email = new Email({
      emailname,
      mobileNumber,
      password: hashedPassword,
      email
    });

    // Save new email to db
    const newEmail = await email.save();
    return res
      .status(200)
      .json(
        APIsuccess(200, { email: 'Created.', redirect: true, email: Email.sanitizeEmailData(newEmail) })
      );
  } catch (err) {
    return res.status(500).json(APIerror(500, { err }));
  }
};
