import ACCOUNT from '../sql/account';
import { Request, Response, NextFunction } from 'express';

const ACC = new ACCOUNT();

const authenticationMiddleware = async (
	req: Request,
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
		const isLogin = await ACC.login_status();
		if (isLogin) {
			const decoded = await ACC.decodeToken(token);
			const deviceFound = await ACC.getDevice(decoded.id);
			const account = await ACC.me();

			if (deviceFound) {
				if (account) {
					next();
				} else {
					return res.status(401).json({
						status: 401,
						error: true,
						message: 'Unauthorized',
						data: null,
					});
				}
			}
		} else {
			return res.status(401).json({
				status: 200,
				error: true,
				message: 'Unauthorized, please create an account',
				data: null,
			});
		}
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