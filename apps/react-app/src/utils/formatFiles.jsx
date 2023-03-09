import { ChonkyIconName } from "chonky";

export function formatFiles(files) {
  let temp = {};
  files.forEach((file) => {
    if (!file.isDir) {
      delete file["isDir"];
      file["droppable"] = false;
      file["icon"] = ChonkyIconName.file;
    } else if (file.isDir) {
      delete file["size"];
      file["icon"] = ChonkyIconName.folder;
    }

    temp[file.id] = { ...file };
  });
  return temp;
}
