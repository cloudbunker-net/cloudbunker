import React, { useState, useEffect } from "react";
import Invoices from "./TableItem";
import { SkeletonTableItem } from "./SkeletonTableItem";

function InvoicesTable({ selectedItems }) {
  const files = [
    {
      id: 1,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Shared",
    },
    {
      id: 2,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Shared",
    },
    {
      id: 3,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 4,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 5,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 6,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 7,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 8,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
    {
      id: 9,
      name: "file.txt",
      date_modified: "2/21/2023 5:11 PM",
      type: "Text Document",
      size: "1.2 MB",
      shared: "Private",
    },
  ];

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setList(files);
      setLoading(false);
    }, 3000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              {list.map((file) => {
                return (
                  <Invoices
                    key={file.id}
                    name={file.name}
                    date_modified={file.date_modified}
                    type={file.type}
                    size={file.size}
                    shared={file.shared}
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
