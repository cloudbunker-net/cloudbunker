import { NextFunction, Response } from "express";

import { getStorageLimit } from "../utils/getStorageLimit";
import { prisma } from "../utils/prisma";

export const getCreateFolder = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { folder, parentId } = req.body;

  if (!folder) {
    return res.status(400).json({
      msg: "No folder/parentId name to create was provided",
      success: false,
    });
  }

  if (!parentId) {
    return res.status(400).json({
      msg: "No parent folder id was provided",
      success: false,
    });
  }

  const existingFolder = await prisma.file.findFirst({
    where: {
      AND: [
        { name: folder },
        { email: req.user.email },
        { parentId: parentId },
      ],
    },
  });

  if (existingFolder) {
    return res.status(400).json({
      msg: "File with same name already exists in the given folder",
      success: false,
    });
  }

  // Create a folder
  const newFolder: any = await prisma.file
    .create({
      data: {
        name: folder,
        size: 0,
        email: req.user.email,
        parentId: parentId,
        isDir: true,
        s3Key: "",
      },
    })
    .catch((err) => {
      return res.status(400).json({ msg: err, success: false });
    });

  // Update parent folder
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
        childrenIds: [...parentFolder.childrenIds, newFolder.id],
      },
    })
    .catch((err) => {
      return res.status(400).json({ msg: err, success: false });
    });

  return res.json({
    msg: "Folder created successfully",
    success: true,
  });
};
