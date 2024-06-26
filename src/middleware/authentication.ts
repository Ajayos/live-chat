import ACCOUNT from '../sql/account';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
	user: any;
	token: string;
}

const ACC = new ACCOUNT();

const authenticationMiddleware = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction,
	
) => {
	try {
		const authToken = req.headers.authorization;
		if (!authToken) {
			return res.status(401).json({
				status: 401,
				error: true,
				message: 'Unauthorized',
				data: null,
			});
		}
		const token = authToken.split(' ')[1];
		if (!token) {
			return res.status(401).json({
				status: 401,
				error: true,
				message: 'Unauthorized',
				data: null,
			});
		}
		const user = await ACC.getUser(token);
		if (!user) {
			return res.status(401).json({
				status: 401,
				error: true,
				message: 'Unauthorized',
				data: null,
			});
		}
		req.user = user;
		req.token = token;
		next();
	} catch (err: any) {
		return {
			status: 500,
			error: true,
			message: 'Internal server error',
			data: err.message || null,
		};
	}
};

export default authenticationMiddleware;