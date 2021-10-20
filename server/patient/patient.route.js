import express from 'express';

// Controllers
import { processPatientCsv } from './patient.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/process-csv').get(processPatientCsv);
//router.route('/:patientId').get(isAuth(), getPatientByIdController);

// router.route('/:patientId').put(validate(paramValidation.updatePatient), patientCtrl.update)
// router.route('/:patientId').delete(patientCtrl.remove)

export default router;
