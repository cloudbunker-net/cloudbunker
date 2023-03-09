import React from "react";

function PaginationClassic() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <nav
        className="mb-4 sm:mb-0 sm:order-1 px-6"
        role="navigation"
        aria-label="Navigation"
      >
        <ul className="flex justify-center mt-1">
          <li className="ml-3 first:ml-0">
            <a
              className="btn bg-[#331832] rounded-md py-1 border-slate-200 text-slate-300 cursor-not-allowed"
              href="#0"
              disabled
            >
              &lt;- Previous
            </a>
          </li>
          <li className="ml-3 first:ml-0">
            <a
              className="btn bg-[#331832] hover:bg-[#1C1D0B] rounded-md py-1 border-slate-200 hover:border-slate-300 text-white"
              href="#0"
            >
              Next -&gt;
            </a>
          </li>
        </ul>
      </nav>
      <div className="text-sm text-slate-500 text-center sm:text-left px-6">
        Showing <span className="font-medium text-slate-600">1</span> to{" "}
        <span className="font-medium text-slate-600">10</span> of{" "}
        <span className="font-medium text-slate-600">467</span> files
      </div>
    </div>
  );
}

export default PaginationClassic;
