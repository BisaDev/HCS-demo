import express from 'express';
import isAuth from '../middleware/is-auth';

// Controllers
import { getEmailByIdController, createEmailController } from './email.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').post(createEmailController);
router.route('/:emailId').get(isAuth(), getEmailByIdController);

// router.route('/:emailId').put(validate(paramValidation.updateEmail), emailCtrl.update)
// router.route('/:emailId').delete(emailCtrl.remove)

export default router;
