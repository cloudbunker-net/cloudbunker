import { Response } from "express";
import { prisma } from "../utils/prisma";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_END_POINT,
  s3ForcePathStyle: true,
});

export async function getPublicFileLink(req: any, res: Response) {
  const { fileName } = req.body;
  const user = req.user;

  // Check if the user has permission to share the file
  const localUser: any = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (localUser.plan === "free" || localUser.plan === "special") {
    return res.status(403).send({
      error: "File sharing is not allowed with your current plan",
      success: false,
    });
  }

  // Find the file in the database
  const file: any = await prisma.file.findFirst({
    where: { name: fileName, email: user.email },
  });

  if (!file) {
    return res.status(404).json({ error: "File not found", success: false });
  }

  // If the file is already shared, return the public link
  if (file.shared && file.publicLink) {
    return res.json({ link: file.publicLink, success: true });
  }

  // Generate a public link for the file
  const s3Params = {
    Bucket: "user-files",
    Key: file.s3Key,
    Expires: 60, // 1 year expiration time
  };

  const publicUrl = await s3.getSignedUrlPromise("getObject", s3Params);

  // Update the file in the database with the public link
  await prisma.file.update({
    where: { id: file.id },
    data: { shared: true, publicLink: publicUrl },
  });

  return res.json({ link: publicUrl, success: true });
}
