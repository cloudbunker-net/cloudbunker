import { Response } from 'express';

export const getTestAuth = async (req: any, res: Response) => {
	return res.json({
		user: req.user,
		token: req.headers.authorization.split(' ')[1],
	});
};
