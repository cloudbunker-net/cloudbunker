import React, { useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import AccountPanel from "./AccountPanel";
import { useAuth0 } from "@auth0/auth0-react";

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth0();

  if (user) {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-[#f6f6f4]">
          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main>
            <div className="w-full max-w-6xl">
              {/* Content */}
              <div className="bg-[#f6f6f4] mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <AccountPanel />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-[#f6f6f4]">
          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main>
            <div className="w-full max-w-6xl">
              {/* Content */}
              <div className="bg-[#f6f6f4] mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow">
                    {/* Panel body */}
                    <div className="p-6 space-y-6 text-sm text-black">
                      <p>You are not logged in</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Settings;
