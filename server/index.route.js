import express from 'express';
import patientRoutes from './patient/patient.route'
import { APIsuccess } from './helpers/API-responses';

const router = express.Router(); // eslint-disable-line new-cap

// Testing routes /api/test && /api/test-auth
router.get('/test', (req, res) =>
  res.status(200).json(APIsuccess(200, { message: 'Hey it works!' }))
);

// Users routes /api/users
router.use('/patient', patientRoutes);
 
export default router;
