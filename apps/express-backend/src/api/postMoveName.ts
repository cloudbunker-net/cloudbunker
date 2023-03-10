import { NextFunction, Response } from 'express';
import { prisma } from '../utils/prisma';

export const postMoveName = async (req: any, res: Response, next: NextFunction) => {
	const { name, parentId, endParentId } = req.body;

	if (!name) {
		return res.status(400).json({
			msg: 'No folder/parentId name to create was provided',
			success: false,
		});
	}

	if (!parentId) {
		return res.status(400).json({
			msg: 'No parent folder id was provided',
			success: false,
		});
	}

	if (!endParentId) {
		return res.status(400).json({
			msg: 'No end parent folder id was provided',
			success: false,
		});
	}

	const existingFolder = await prisma.file.findFirst({
		where: {
			AND: [{ name: name }, { email: req.user.email }, { parentId: endParentId }],
		},
	});

	if (existingFolder) {
		return res.status(400).json({
			msg: 'File/Folder with same name already exists in the given folder',
			success: false,
		});
	}

	// Update parentId of the name
	const parentFolder: any = await prisma.file.findFirst({
		where: {
			id: parentId,
		},
	});

	await prisma.file
		.updateMany({
			where: {
				id: parentId,
				email: req.user.email,
			},
			data: {
				childrenIds: parentFolder.childrenIds.filter((childId: any) => childId !== name),
			},
		})
		.catch((err) => {
			return res.status(400).json({ msg: err, success: false });
		});

	// Update endParentId of the name
	const endParentFolder: any = await prisma.file.findFirst({
		where: {
			id: endParentId,
		},
	});

	await prisma.file
		.updateMany({
			where: {
				id: endParentId,
				email: req.user.email,
			},
			data: {
				childrenIds: [...endParentFolder.childrenIds, name],
			},
		})
		.catch((err) => {
			return res.status(400).json({ msg: err, success: false });
		});

	// Update name
	await prisma.file
		.updateMany({
			where: {
				id: name,
				email: req.user.email,
			},
			data: {
				parentId: endParentId,
			},
		})
		.catch((err) => {
			return res.status(400).json({ msg: err, success: false });
		});

	return res.json({
		msg: 'Folder created successfully',
		success: true,
	});
};
