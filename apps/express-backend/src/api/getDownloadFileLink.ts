import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Response } from 'express';
import { prisma } from '../utils/prisma';

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
	region: 'eu',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
	},
	endpoint: process.env.AWS_END_POINT,
	forcePathStyle: true,
});

export const getDownloadFileLink = async (req: any, res: Response) => {
	const user = req.user;
	const { fileName } = req.body;

	if (!fileName) {
		return res.status(400).json({ message: 'File name missing', success: false });
	}

	const file = await prisma.file.findFirst({
		where: { name: fileName as string, email: user.email },
	});

	if (!file) {
		return res.status(404).json({ message: 'File not found', success: false });
	}

	const command = new GetObjectCommand({
		Bucket: 'user-files',
		Key: file.s3Key,
		ResponseContentDisposition: `attachment; filename="${file.name}"`,
	});

	// Expiration time is set to 60 seconds for presigned link
	const url = await getSignedUrl(s3, command, { expiresIn: 60 });

	return res.json({
		msg: 'Pre-signed link for download has been generated',
		url: url,
		fileName: file.name,
		size: file.size,
		success: true,
	});
};
