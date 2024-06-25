import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
// @ts-ignore
import handleResponse from '../util/handleResponse';
import {
	me as me_,
	login as login_,
	create as create_,
} from '../services/account';

export const me = asyncHandler(async (req: Request, res: Response) => {
	const result = await me_(req.query.token as string);
	handleResponse(Promise.resolve(result), res);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
	if (req?.body?.token) {
		const result = await me_(req.body.token as string);
		handleResponse(Promise.resolve(result), res);
	} else {
		const result = await login_(req.body);
		handleResponse(Promise.resolve(result), res);
	}
});

export const create = asyncHandler(async (req: Request, res: Response) => {
	const result = await create_(req.body);
	handleResponse(Promise.resolve(result), res);
});