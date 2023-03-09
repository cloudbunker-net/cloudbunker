import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Transition from "../utils/Transition";
import { useAuth0 } from "@auth0/auth0-react";
import Skeleton from "react-loading-skeleton";

function DropdownProfile({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isLoading, logout, loginWithRedirect } = useAuth0();

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // logout user
  const onLogout = async () => {
    logout();
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <div className="flex items-center truncate">
          {isLoading && <Skeleton width={100} />}
          {!isLoading && !user && (
            <span className="truncate ml-2 text-sm font-medium text-black group-hover:text-slate-700">
              [not logged in]
            </span>
          )}
          {!isLoading && user && (
            <span className="truncate ml-2 text-sm font-medium text-black group-hover:text-slate-700">
              {user.email}
            </span>
          )}

          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-[#3F7CAC]"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-[#E4E3DD] border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200">
            <div className="font-medium text-slate-800">Freemium</div>
            <div className="text-xs text-slate-500 italic">Until 3/22/2023</div>
          </div>
          <ul>
            <div>
              <li>
                <Link
                  className="font-medium text-sm text-[#3F7CAC] hover:text-[#5B96C2] flex items-center py-1 px-3"
                  to="/settings"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Upgrade
                </Link>
              </li>
              <li>
                <Link
                  className="font-medium text-sm text-[#3F7CAC] hover:text-[#5B96C2] flex items-center py-1 px-3"
                  to="/settings"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Settings
                </Link>
              </li>
            </div>
            <li>
              <button
                className="font-medium text-sm text-[#3F7CAC] hover:text-[#5B96C2] flex items-center py-1 px-3"
                onClick={() => onLogout() && setDropdownOpen(!dropdownOpen)}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;
