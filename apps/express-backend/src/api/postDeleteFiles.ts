import {
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NextFunction, Response } from "express";

import { prisma } from "../utils/prisma";

const s3 = new S3Client({
  region: "eu",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  endpoint: process.env.AWS_END_POINT,
  forcePathStyle: true,
});

export const postDeleteFiles = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { filesArray } = req.body;

  if (!filesArray) {
    return res.status(400).json({
      msg: "No files were selected",
      success: false,
    });
  }

  filesArray.forEach(async (file: any) => {
    // Get the name
    const nameFile: any = await prisma.file.findFirst({
      where: {
        id: file.id,
        email: req.user.email,
      },
    });

    if (!nameFile) {
      return res
        .status(400)
        .json({ msg: `Name "${nameFile.name}" not found`, success: false });
    }

    if (nameFile.isDir === true) {
      // Delete all files in the folder
      const deleteFolder = async (folderId: any) => {
        const folder: any = await prisma.file.findFirst({
          where: {
            id: folderId,
          },
        });

        if (folder.childrenIds.length > 0) {
          // Recursively delete all child folders
          for (const childId of folder.childrenIds) {
            await deleteFolder(childId);
          }
        }

        if (folder.isDir === false) {
          // Delete object name from s3
          const deleteObjectCommand = new DeleteObjectCommand({
            Bucket: "user-files",
            Key: folder.s3Key,
          });
          await s3.send(deleteObjectCommand);
        }

        // Delete the folder
        await prisma.file.deleteMany({
          where: {
            id: folderId,
            email: req.user.email,
          },
        });

        // Update the parent folder
        const parentFolder: any = await prisma.file.findFirst({
          where: {
            id: folder.parentId,
          },
        });

        await prisma.file.updateMany({
          where: {
            id: folder.parentId,
            email: req.user.email,
          },
          data: {
            childrenIds: parentFolder.childrenIds.filter(
              (childId: any) => childId !== folder.id
            ),
          },
        });
      };

      await deleteFolder(file.id);

      res.json({
        msg: "Folder deleted successfully",
        success: true,
      });
    } else {
      // In case if the file entry given is not a directory
      // Delete object name from s3
      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: "user-files",
        Key: nameFile.s3Key,
      });
      await s3.send(deleteObjectCommand);

      // Update parent folder of the name
      const parentFolder: any = await prisma.file.findFirst({
        where: {
          id: nameFile.parentId,
        },
      });

      await prisma.file
        .updateMany({
          where: {
            id: nameFile.parentId,
            email: req.user.email,
          },
          data: {
            childrenIds: parentFolder.childrenIds.filter(
              (childId: any) => childId !== nameFile.id
            ),
          },
        })
        .catch((err) => {
          return res.status(400).json({ msg: err, success: false });
        });

      // Delete the name
      await prisma.file
        .deleteMany({
          where: {
            id: nameFile.id,
            email: req.user.email,
          },
        })
        .catch((err) => {
          return res.status(400).json({ msg: err, success: false });
        });

      await prisma.file
        .updateMany({
          where: {
            id: nameFile.parentId,
            email: req.user.email,
          },
          data: {
            childrenIds: parentFolder.childrenIds.filter(
              (childId: any) => childId !== nameFile.id
            ),
          },
        })
        .catch((err) => {
          return res.status(400).json({ msg: err, success: false });
        });

      return res.json({
        msg: "File deleted successfully",
        success: true,
      });
    }
  });
};
