import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

import * as ACC from '../controllers/account';
import authenticationMiddleware from '../middleware/authentication';

router.post('/create', ACC.create);
router.post('/login', ACC.login);
// @ts-ignore
router.route('/').get(ACC.me).put(authenticationMiddleware, ACC.update);
