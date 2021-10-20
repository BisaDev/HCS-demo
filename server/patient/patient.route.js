import express from 'express';

// Controllers
import { processPatientCsv } from './patient.controller';

const router = express.Router();

router.route('/process-csv').get(processPatientCsv);

export default router;
