import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

/* Dropdown when email in the header is clicked */
import UserMenu from '../components/DropdownProfile';

function Header({ sidebarOpen, setSidebarOpen }) {
	return (
		<header className="sticky top-0 bg-[#F6F6F4] border-b border-slate-200 z-30">
			<div className="px-4 sm:px-6">
				<div className="flex items-center justify-between h-12 -mb-px">
					{/* Header: Left side */}
					<div className="flex">
						{/* Hamburger button */}
						<button
							className="text-slate-500 hover:text-slate-600 lg:hidden"
							aria-controls="sidebar"
							aria-expanded={sidebarOpen}
							onClick={(e) => {
								e.stopPropagation();
								setSidebarOpen(!sidebarOpen);
							}}
						>
							<span className="sr-only">Open sidebar</span>
							<svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<rect x="4" y="5" width="16" height="2" />
								<rect x="4" y="11" width="16" height="2" />
								<rect x="4" y="17" width="16" height="2" />
							</svg>
						</button>

						<div>{/* To put things out there, so they are visible */}</div>
					</div>

					{/* Header: Right side */}
					<div className="flex items-center space-x-3">
						<div className="hidden md:flex">
							{/* Upgrade button */}
							<ul className="flex flex-wrap -m-1">
								<li className="m-1">
									<NavLink
										to="/settings"
										className="inline-flex items-center justify-center rounded-md text-sm font-medium leading-5 px-3 py-1 border border-transparent shadow-sm bg-[#3F7CAC] hover:bg-[#2C5777] text-white duration-150 ease-in-out"
									>
										Upgrade
									</NavLink>
								</li>
							</ul>
						</div>
						{/*  Divider */}
						<hr className="w-px h-6 bg-slate-200 mx-3" />
						<UserMenu align="right" />
					</div>
				</div>
			</div>
		</header>
	);
}

export default Header;
