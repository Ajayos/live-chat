import { Response } from 'express';

const handleResponse = async (promise: Promise<any>, res: Response): Promise<any> => {
	try {
		const output = await promise;
		const { status, error } = output;

		if (error) {
			return res.status(status).json(output);
		}

		return res.status(status).json(output);
	} catch (error: any) {
		return res.status(500).json({
			status: 500,
			error: true,
			message: 'Internal server error',
			data: error.message || null,
		});
	}
};

export default handleResponse;