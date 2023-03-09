import React, { useState, useEffect } from "react";
import Invoices from "./TableItem";
import { SkeletonTableItem } from "./SkeletonTableItem";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import dateFormat, { masks } from "dateformat";
import { filesize } from "filesize";

function InvoicesTable({ selectedItems }) {
  const { getAccessTokenSilently } = useAuth0();

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        "http://localhost:3000/api/get-files-metadata",
        {
          perPage: 10,
          page: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFiles(response.data.files);
      setLoading(false);
    };
    fetchData();
  }, [getAccessTokenSilently]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(list.map((li) => li.id));
    if (selectAll) {
      setIsCheck([]);
    }
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setSelectAll(false);
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  useEffect(() => {
    selectedItems(isCheck);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheck]);

  return (
    <div className="bg-[#f6f6f4] relative">
      <div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-black bg-[#E4E3DD] border-t border-b border-slate-200">
              <tr>
                <th className="first:pl-6 last:pr-6 py-3 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <label className="inline-flex">
                      <span className="sr-only">Select all</span>
                      <input
                        className="form-checkbox"
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </label>
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Name</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Date modified</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Type</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Size</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Shared</div>
                </th>
                {/* For the delete and donwload icons */}
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"></th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-md">
              {loading && <SkeletonTableItem cards={30} />}
              {files.map((file) => {
                return (
                  <Invoices
                    key={file.id}
                    name={file.name}
                    date_modified={dateFormat(
                      file.date,
                      (masks.date = "dd/mm/yyyy h:MM TT")
                    )}
                    type={file.type}
                    size={filesize(file.size, {
                      base: 2,
                      standard: "jedec",
                      round: 0,
                    })}
                    shared={file.shared ? "True" : "False"}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(file.id)}
                    loading={loading}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InvoicesTable;
