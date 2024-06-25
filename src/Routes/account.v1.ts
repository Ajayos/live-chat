import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

import { me, login, create } from '../controllers/account';

router.route('/').post(login); //.delete(logout);

router.route('/me').get(me).post(create);

export default router;