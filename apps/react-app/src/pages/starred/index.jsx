import React, { useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import InvoicesTable from './Table';

function MyFiles() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [selectedItems, setSelectedItems] = useState([]);

	const handleSelectedItems = (selectedItems) => {
		setSelectedItems([...selectedItems]);
	};

	return (
		<div className="flex h-screen overflow-hidden bg-[#f6f6f4]">
			{/* Sidebar */}
			<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

			{/* Content area */}
			<div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
				{/*  Site header */}
				<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

				<main>
					<div className="py-2 w-full max-w-full mx-auto">
						{/* More actions */}
						<div className="sm:flex sm:justify-between sm:items-center mb-2">
							{/* Left side */}
							<div className="mb-4 ml-6 sm:mb-0">
								<p className="text-sm font-medium text-black">[Starred]</p>
							</div>
						</div>

						{/* Table */}
						<InvoicesTable selectedItems={handleSelectedItems} />
					</div>
				</main>
			</div>
		</div>
	);
}

export default MyFiles;
