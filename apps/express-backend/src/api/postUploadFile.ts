import {
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NextFunction, Response } from "express";

import { getStorageLimit } from "../utils/getStorageLimit";
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

const getObjectSize = async (params: any) => {
  const headObject = new HeadObjectCommand(params);
  const response = await s3.send(headObject);
  const objectSize = response.ContentLength;
  return objectSize;
};

export const postUploadFile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body.parentId = req.body.parentId;

    if (!req.body.parentId) {
      return res.json({ msg: "No parent folder selected", success: false });
    }

    // check if the parent folder exists
    const parentFolder = await prisma.file.findFirst({
      where: {
        id: req.body.parentId,
        email: req.user.email,
      },
    });

    const multerFile: any = req.files.file[0];

    if (!parentFolder) {
      // delete object from s3
      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: "user-files",
        Key: multerFile.key,
      });
      await s3.send(deleteObjectCommand);

      return res.status(400).json({
        msg: "Parent folder not found",
        success: false,
      });
    }

    // Reliably get file size
    let fileSize: any;
    const command = {
      Bucket: "user-files",
      Key: multerFile.key,
    };
    try {
      fileSize = getObjectSize(command);
    } catch (error) {
      res.status(500).json({ msg: "Error getting file size", success: false });
    }

    fileSize.then(async (data: any) => {
      multerFile.size = data;

      /* Start: Basic checks */
      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: "user-files",
        Key: multerFile.key,
      });

      if (!multerFile.size) {
        await s3.send(deleteObjectCommand);

        return res.status(400).json({
          msg: "No file was uploaded",
          success: false,
        });
      }
      /* End: Basic checks */

      /* Start: Check if user has exceeded storage limit */
      const storageLimit = await getStorageLimit(req.localUser.plan);
      const userFilesSize = await prisma.file.aggregate({
        _sum: {
          size: true,
        },
        where: {
          email: req.user.email,
        },
      });
      if (userFilesSize._sum.size + multerFile.size > storageLimit) {
        return res.status(400).json({
          msg: "You have exceeded your storage limit",
          success: false,
        });
      }
      /* End: Check if user has exceeded storage limit */

      /* Start: Check if the same file already exists in the same folder */
      if (req.body.parentId) {
        const existingFile = await prisma.file.findFirst({
          where: {
            AND: [
              { name: multerFile.originalname },
              { email: req.user.email },
              { parentId: req.body.parentId },
            ],
          },
        });

        if (existingFile) {
          return res.status(400).json({
            msg: "File with same name already exists in the given folder",
            success: false,
          });
        }
      }
      /* End: Check if the same file already exists in the same folder */

      /* Start: Add file metadata to the database */
      const file: any = await prisma.file
        .create({
          data: {
            name: multerFile.originalname,
            size: multerFile.size,
            email: req.user.email,
            parentId: req.body.parentId,
            s3Key: multerFile.key,
          },
        })
        .catch((error) => {
          return res.json({ msg: error, success: false });
        });

      const parentFolder: any = await prisma.file.findFirst({
        where: {
          id: req.body.parentId,
        },
      });

      const updatedFile = await prisma.file.updateMany({
        where: {
          id: req.body.parentId,
          email: req.user.email,
        },
        data: {
          childrenIds: [...parentFolder.childrenIds, file.id],
        },
      });
      /* End: Add file metadata to the database */

      return res.json({
        msg: "File uploaded successfully",
        file: req.file,
        parentId: req.body.parentId,
        success: true,
      });
    });
  } catch (error) {
    return res.status(500).json({ msg: "Some error:", success: false });
  }
};
