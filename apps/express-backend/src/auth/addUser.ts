import { NextFunction, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addUser(req: any, res: Response, next: NextFunction) {
	const user = req.user;

	let localUser = await prisma.user.findFirst({
		where: { email: user.email },
	});

	if (!localUser) {
		const newUser = await prisma.user.create({
			data: {
				email: user.email,
			},
		});
		// Here we pass the database user as req.localUser
		// so we can access it later in the API endpoints
		// ! Notice, auth0 user and local user are not the same
		// they do share the same information, but they are stored in
		// different places
		req.localUser = newUser;
	} else {
		req.localUser = localUser;
	}

	next();
}

export { addUser };
