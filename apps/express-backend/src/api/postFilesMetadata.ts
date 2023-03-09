import { Response } from "express";
import { prisma } from "../utils/prisma";

export async function postFilesMetadata(req: any, res: Response) {
  try {
    const { perPage, page } = req.body;
    const email = req.user.email;
    // Count the total number of files for the given email
    const totalFiles = await prisma.file.count({
      where: { email },
    });
    // Calculate the offset based on the requested page and items per page
    const offset = (page - 1) * perPage;

    // Get the metadata for the requested page of files
    const files = await prisma.file.findMany({
      where: { email },
      skip: offset,
      take: perPage,
      orderBy: {
        modDate: "asc",
      },
    });

    const totalPages = Math.ceil(totalFiles / perPage);

    // Return the file metadata and pagination information in the response
    return res.json({
      rootFolderId: req.rootFolderId,
      files,
      success: true,
    });
  } catch (ex: any) {
    console.log(ex);
  }
}
