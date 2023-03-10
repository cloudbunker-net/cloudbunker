import { NextFunction, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function rootFolderCreate(req: any, res: Response, next: NextFunction) {
	const user = req.user;

	let rootFolder = await prisma.file.findMany({
		where: {
			email: user.email,
			name: 'root',
			rootFolder: true,
			isDir: true,
			size: 0,
			s3Key: '',
		},
	});

	// Here we check if root folder exists, if it doesn't
	// we create one
	if (rootFolder.length === 0) {
		const file = await prisma.file.create({
			data: {
				email: user.email,
				name: 'root',
				rootFolder: true,
				isDir: true,
				size: 0,
				s3Key: '',
			},
		});
		req.rootFolderId = file.id;
	} else {
		req.rootFolderId = rootFolder[0].id;
	}

	next();
}

export { rootFolderCreate };
