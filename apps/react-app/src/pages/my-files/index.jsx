import { ChonkyActions, FileHelper, FullFileBrowser } from "chonky";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ChonkyIconFA } from "chonky-icon-fontawesome";
import Header from "../../partials/Header";
import LoadingFiles from "../../../loading.json";
import Sidebar from "../../partials/Sidebar";
import axios from "axios";
import { formatFiles } from "../../utils/formatFiles";
import { useAuth0 } from "@auth0/auth0-react";

function MyFiles() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(LoadingFiles);
  // Folder creation
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [creatingFolderError, setCreatingFolderError] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [isMessageHidden, setIsMessageHidden] = useState(false);
  // Dnd action
  const [isMovingName, setIsMovingName] = useState(false);
  const [movingNameShouldRefetch, setMovingNameShouldRefetch] = useState(false);
  // Delete name
  const [isDeletingName, setIsDeletingName] = useState(false);
  const [deletingNameShouldRefetch, setDeletingNameShouldRefetch] =
    useState(false);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently();
      console.log(token);
      const response = await axios
        .post(
          "http://localhost:3000/api/get-files-metadata",
          {
            perPage: 100,
            page: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((err) => {
          console.log(err);
        });
      setLoading(false);
      console.log(response);
      setFileMap(formatFiles([...response.data.files]));
      setCurrentFolderId(response.data.rootFolderId);
      console.log([...response.data.files]);
    };

    if (shouldRefetch) {
      setShouldRefetch(false);
      setFolderBeingCreated("");
      fetchData();
    } else if (movingNameShouldRefetch) {
      setMovingNameShouldRefetch(false);
      fetchData();
    } else if (deletingNameShouldRefetch) {
      setDeletingNameShouldRefetch(false);
      fetchData();
    } else {
      fetchData();
    }
  }, [getAccessTokenSilently, shouldRefetch, movingNameShouldRefetch]);

  const sendCreateFolder = async (folderName, currentFolder) => {
    const token = await getAccessTokenSilently();
    console.log(folderName, currentFolder);
    const data = await axios.post(
      "http://localhost:3000/api/create-folder",
      {
        folder: folderName,
        parentId: currentFolder,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
  };

  const moveName = async (name, currentFolder, endFolder) => {
    const token = await getAccessTokenSilently();
    console.log(name, currentFolder, endFolder);
    const data = await axios.post(
      "http://localhost:3000/api/move-name",
      {
        name: name,
        parentId: currentFolder,
        endParentId: endFolder,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
  };

  const deleteNames = async (filesArray) => {
    const token = await getAccessTokenSilently();
    console.log(filesArray);
    const data = await axios.post(
      "http://localhost:3000/api/delete-files",
      {
        filesArray: filesArray,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
  };

  const downloadFiles = async (filesArray) => {
    const token = await getAccessTokenSilently();
    const data = await axios.post(
      "http://localhost:3000/api/download-files",
      {
        filesArray: filesArray,
      },
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const url = window.URL.createObjectURL(new Blob([data.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "files.zip");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const uploadFiles = async (filesArray) => {
    const token = await getAccessTokenSilently();
    const data = await axios.post(
      "http://localhost:3000/api/upload-files",
      {
        filesArray: filesArray,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const prepareCustomFileMap = () => {
    const baseFileMap = loadingFiles;
    const rootFolderId = "root";
    return { baseFileMap, rootFolderId };
  };

  const closeMessage = () => {
    setIsMessageHidden(true);
  };

  const { baseFileMap, rootFolderId } = useMemo(prepareCustomFileMap, []);
  const [fileMap, setFileMap] = useState(baseFileMap);
  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);
  const [folderBeingCreated, setFolderBeingCreated] = useState("");
  const [folderCreatedStatus, setFolderCreatedStatus] = useState(false);

  const useCustomFileMap = () => {
    // Setup the function used to reset our file map to its initial value. Note that
    // here and below we will always use `useCallback` hook for our functions - this is
    // a crucial React performance optimization, read more about it here:
    // https://reactjs.org/docs/hooks-reference.html#usecallback
    const resetFileMap = useCallback(() => {
      setFileMap(baseFileMap);
      setCurrentFolderId(rootFolderId);
    }, [baseFileMap, rootFolderId]);

    // Setup logic to listen to changes in current folder ID without having to update
    // `useCallback` hooks. Read more about it here:
    // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
    const currentFolderIdRef = useRef(currentFolderId);
    useEffect(() => {
      currentFolderIdRef.current = currentFolderId;
    }, [currentFolderId]);

    // Function that will be called when user deletes files either using the toolbar
    // button or `Delete` key.
    const deleteFiles = useCallback((filesArray) => {
      // We use the so-called "functional update" to set the new file map. This
      // lets us access the current file map value without having to track it
      // explicitly. Read more about it here:
      // https://reactjs.org/docs/hooks-reference.html#functional-updates
      deleteNames(filesArray);

      return filesArray;
    }, []);

    // Function that will be called when files are moved from one folder to another
    // using drag & drop.
    const moveFiles = useCallback((name, parentId, endParentId) => {
      setFileMap((currentFileMap) => {
        moveName(name, parentId, endParentId)
          .then(() => {
            setMovingNameShouldRefetch(true); // Trigger refetch
          })
          .catch((error) => {});

        // const newFileMap = { ...currentFileMap };
        // const moveFileIds = new Set(files.map((f) => f.id));

        // Delete files from their source folder.
        // const newSourceChildrenIds = source.childrenIds.filter(
        //   (id) => !moveFileIds.has(id)
        // );
        // newFileMap[source.id] = {
        //   ...source,
        //   childrenIds: newSourceChildrenIds,
        //   childrenCount: newSourceChildrenIds.length,
        // };

        // Add the files to their destination folder.
        // const newDestinationChildrenIds = [
        //   ...destination.childrenIds,
        //   ...files.map((f) => f.id),
        // ];
        // newFileMap[destination.id] = {
        //   ...destination,
        //   childrenIds: newDestinationChildrenIds,
        //   childrenCount: newDestinationChildrenIds.length,
        // };

        // Finally, update the parent folder ID on the files from source folder
        // ID to the destination folder ID.
        // files.forEach((file) => {
        //   newFileMap[file.id] = {
        //     ...file,
        //     parentId: destination.id,
        //   };
        // });

        return currentFileMap;
      });
    }, []);

    // Function that will be called when user creates a new folder using the toolbar
    // button. That that we use incremental integer IDs for new folder, but this is
    // not a good practice in production! Instead, you should use something like UUIDs
    // or MD5 hashes for file paths.
    const idCounter = useRef(0);
    const createFolder = useCallback((folderName) => {
      setFileMap((currentFileMap) => {
        const newFileMap = { ...currentFileMap };

        // Create the new folder
        // const newFolderId = `new-folder-${idCounter.current++}`;

        setIsCreatingFolder(true);
        setFolderBeingCreated(folderName);
        setIsMessageHidden(true);
        setFolderCreatedStatus(false);
        sendCreateFolder(folderName, currentFolderIdRef.current)
          .then(() => {
            setIsCreatingFolder(false);
            setFolderCreatedStatus(true);
            setShouldRefetch(true); // Trigger refetch
          })
          .catch((error) => {
            console.log(error);
            setCreatingFolderError(true);
            setIsCreatingFolder(false);
            setIsMessageHidden(false);
          });

        // newFileMap[newFolderId] = {
        //   id: newFolderId,
        //   name: folderName,
        //   isDir: true,
        //   parentId: currentFolderIdRef.current,
        //   childrenIds: [],
        //   childrenCount: 0,
        // };

        // // Update parent folder to reference the new folder.
        // const parent = newFileMap[currentFolderIdRef.current];
        // newFileMap[currentFolderIdRef.current] = {
        //   ...parent,
        //   childrenIds: [...parent.childrenIds, newFolderId],
        // };

        return currentFileMap;
      });
    }, []);

    return {
      fileMap,
      currentFolderId,
      setCurrentFolderId,
      resetFileMap,
      deleteFiles,
      moveFiles,
      createFolder,
    };
  };

  function useFolderChain(fileMap, currentFolderId) {
    return useMemo(() => {
      const currentFolder = fileMap[currentFolderId];

      const folderChain = [currentFolder];

      let parentId = currentFolder.parentId;
      while (parentId) {
        const parentFile = fileMap[parentId];
        if (parentFile) {
          folderChain.unshift(parentFile);
          parentId = parentFile.parentId;
        } else {
          break;
        }
      }

      return folderChain;
    }, [currentFolderId, fileMap]);
  }

  const useFileActionHandler = (
    setCurrentFolderId,
    deleteFiles,
    moveFiles,
    createFolder
  ) => {
    return useCallback(
      (data) => {
        if (data.id === ChonkyActions.OpenFiles.id) {
          const { targetFile, files } = data.payload;
          const fileToOpen = targetFile ?? files[0];
          if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
            setCurrentFolderId(fileToOpen.id);
            return;
          }
        } else if (data.id === ChonkyActions.DeleteFiles.id) {
          console.log("Test", data);
          deleteFiles(data.state.selectedFilesForAction);
        } else if (data.id === ChonkyActions.MoveFiles.id) {
          console.log(data.payload);
          moveFiles(
            data.payload.draggedFile.id,
            data.payload.source.id,
            data.payload.destination.id
          );
        } else if (data.id === ChonkyActions.CreateFolder.id) {
          const folderName = prompt("Provide the name for your new folder:");
          if (folderName) createFolder(folderName);
        } else if (data.id === ChonkyActions.UploadFiles.id) {
          // Open the file explorer for user
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.onchange = (event) => {
            const files = event.target.files;
            if (files) {
              const filesArray = Array.from(files);
              console.log(filesArray);
              // moveFiles(filesArray, null, data.payload.destination.id);
            }
          };
          input.click();
        } else if (data.id === ChonkyActions.DownloadFiles.id) {
          downloadFiles(data.state.selectedFiles);
        }
      },
      [createFolder, deleteFiles, moveFiles, setCurrentFolderId]
    );
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };

  const { resetFileMap, deleteFiles, moveFiles, createFolder } =
    useCustomFileMap();

  const thumbnailGenerator = useCallback(
    (file) =>
      file.thumbnailUrl ? `https://chonky.io${file.thumbnailUrl}` : null,
    []
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f6f4]">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="h-screen">
          <div className="py-2 w-full max-w-full h-full mx-auto">
            {creatingFolderError && !isMessageHidden && (
              <div
                id="alert-2"
                class="flex ml-4 p-2 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Info</span>
                <div class="ml-3 text-sm font-medium">
                  An error happened when creating {folderBeingCreated} folder.
                  If given folder already has a folder with the same name,
                  please choose a different name.
                </div>
                <button
                  type="button"
                  class="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                  data-dismiss-target="#alert-2"
                  onClick={() => setIsMessageHidden(true)}
                  aria-label="Close"
                >
                  <span class="sr-only">Close</span>
                  <svg
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
            {isCreatingFolder && (
              <div
                id="alert-1"
                class="flex ml-4 p-2 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                role="alert"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Info</span>

                <div class="ml-3 text-sm font-medium">
                  A folder {folderBeingCreated} is being created on the server,
                  please wait for a few seconds
                </div>
                <button
                  type="button"
                  class="ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                  data-dismiss-target="#alert-1"
                  aria-label="Close"
                >
                  <span class="sr-only">Close</span>
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
            {folderCreatedStatus && (
              <div
                id="alert-3"
                class="flex ml-4 p-2 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                role="alert"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Info</span>
                <div class="ml-3 text-sm font-medium">
                  Operation was successfully completed
                </div>
                <button
                  type="button"
                  class="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
                  data-dismiss-target="#alert-3"
                  onClick={() => setFolderCreatedStatus(false)}
                  aria-label="Close"
                >
                  <span class="sr-only">Close</span>
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            )}

            <div className="h-full">
              <FullFileBrowser
                files={useMemo(() => {
                  const currentFolder = fileMap[currentFolderId];
                  const childrenIds = currentFolder.childrenIds;
                  const files = childrenIds.map((fileId) => fileMap[fileId]);
                  return files;
                }, [currentFolderId, fileMap])}
                folderChain={useFolderChain(fileMap, currentFolderId)}
                fileActions={useMemo(
                  () => [
                    ChonkyActions.CreateFolder,
                    ChonkyActions.DeleteFiles,
                    ChonkyActions.UploadFiles,
                    ChonkyActions.DownloadFiles,
                  ],
                  []
                )}
                onFileAction={useFileActionHandler(
                  setCurrentFolderId,
                  deleteFiles,
                  moveFiles,
                  createFolder
                )}
                thumbnailGenerator={thumbnailGenerator}
                defaultFileViewActionId="enable_list_view"
                defaultSortActionId="sort_files_by_date"
                disableDragAndDropProvider={true}
                iconComponent={ChonkyIconFA}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyFiles;
