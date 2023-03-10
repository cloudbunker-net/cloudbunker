import { Response, NextFunction } from 'express';
import axios from 'axios';

export const userContext = async (req: any, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const response = await axios.get('https://dev-82d7cozfjn24fqem.us.auth0.com/userinfo', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const userInfo = response.data;
		req.user = userInfo; // Set the user object on the request object

		next(); // Pass control to the next middleware function
	} catch (e) {
		res.json({ msg: 'There was an error, when getting JWT token.', error: e });
	}
};
