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
		req.localUser = newUser;
	} else {
		req.localUser = localUser;
	}

	next();
}

export { addUser };
