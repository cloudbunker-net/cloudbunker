import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Icons
import { BsFilesAlt, BsFillInfoSquareFill, BsLink45Deg, BsStarFill, BsTrash } from 'react-icons/bs';

// Images
import LOGO from './../images/logo.webp';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
	const location = useLocation();
	const { pathname } = location;

	const trigger = useRef(null);
	const sidebar = useRef(null);

	const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
	const [sidebarExpanded, setSidebarExpanded] = useState(
		storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
	);

	// Close on click outside
	useEffect(() => {
		const clickHandler = ({ target }) => {
			if (!sidebar.current || !trigger.current) return;
			if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
			setSidebarOpen(false);
		};
		document.addEventListener('click', clickHandler);
		return () => document.removeEventListener('click', clickHandler);
	});

	// Close if the esc key is pressed
	useEffect(() => {
		const keyHandler = ({ keyCode }) => {
			if (!sidebarOpen || keyCode !== 27) return;
			setSidebarOpen(false);
		};
		document.addEventListener('keydown', keyHandler);
		return () => document.removeEventListener('keydown', keyHandler);
	});

	useEffect(() => {
		localStorage.setItem('sidebar-expanded', sidebarExpanded);
		if (sidebarExpanded) {
			document.querySelector('body').classList.add('sidebar-expanded');
		} else {
			document.querySelector('body').classList.remove('sidebar-expanded');
		}
	}, [sidebarExpanded]);

	// Color of the text in navigation button
	const activeNavlink = ({ isActive }) => {
		return {
			color: isActive ? 'white' : 'slate-600',
		};
	};

	return (
		<div>
			{/* Sidebar backdrop (mobile only) */}
			<div
				className={`fixed inset-0 bg-[#EAE9E4] bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
					sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
				aria-hidden="true"
			></div>

			{/* Sidebar */}
			<div
				id="sidebar"
				ref={sidebar}
				className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-[#EAE9E4] p-4 transition-all duration-200 ease-in-out ${
					sidebarOpen ? 'translate-x-0' : '-translate-x-64'
				}`}
			>
				{/* Sidebar header */}
				<div className="flex justify-between mb-2 pr-3">
					{/* Close button */}
					<button
						ref={trigger}
						className="lg:hidden text-slate-500 hover:text-slate-400"
						onClick={() => setSidebarOpen(!sidebarOpen)}
						aria-controls="sidebar"
						aria-expanded={sidebarOpen}
					>
						<span className="sr-only">Close sidebar</span>
						<svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
						</svg>
					</button>
					{/* Logo */}
					<NavLink end to="/" className="block">
						<img src={LOGO} alt="Logo" className="h-12" />
					</NavLink>
				</div>

				{/* Links */}
				<div className="space-y-8">
					{/* Pages group */}
					<div>
						<ul className="mt-3">
							<h3 className="text-xs uppercase text-[#331832] font-bold mb-1">
								<span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
									•••
								</span>
								<span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Main</span>
							</h3>
							{/* My Files */}
							<li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/' && 'bg-[#331832]'}`}>
								<NavLink end to="/" className={`block text-slate-800 truncate transition duration-150`} style={activeNavlink}>
									<div className="flex items-center justify-between">
										<div className="grow flex items-center">
											<BsFilesAlt className={`flex-0 h-6 w-6 ${pathname === '/' ? 'text-white' : 'text-black'}`} />
											<span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
												My Files
											</span>
										</div>
									</div>
								</NavLink>
							</li>

							{/* Shared */}
							<li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/shared' && 'bg-[#331832]'}`}>
								<NavLink
									end
									to="/shared"
									className={`block text-slate-800 truncate transition duration-150`}
									style={activeNavlink}
								>
									<div className="flex items-center justify-between">
										<div className="grow flex items-center">
											<BsLink45Deg className={`flex-0 h-6 w-6 ${pathname === '/shared' ? 'text-white' : 'text-black'}`} />
											<span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
												Shared
											</span>
										</div>
									</div>
								</NavLink>
							</li>

							{/* Starred*/}
							<li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/starred' && 'bg-[#331832]'}`}>
								<NavLink
									end
									to="/starred"
									className={`block text-slate-800 truncate transition duration-150`}
									style={activeNavlink}
								>
									<div className="flex items-center justify-between">
										<div className="grow flex items-center">
											<BsStarFill className={`flex-0 h-6 w-6 ${pathname === '/starred' ? 'text-white' : 'text-black'}`} />
											<span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
												Starred
											</span>
										</div>
									</div>
								</NavLink>
							</li>

							{/* Trash */}
							<li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/trash' && 'bg-[#331832]'}`}>
								<NavLink
									end
									to="/trash"
									className={`block text-slate-800 truncate transition duration-150`}
									style={activeNavlink}
								>
									<div className="flex items-center justify-between">
										<div className="grow flex items-center">
											<BsTrash className={`flex-0 h-6 w-6 ${pathname === '/trash' ? 'text-white' : 'text-black'}`} />
											<span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
												Trash
											</span>
										</div>
									</div>
								</NavLink>
							</li>
						</ul>
					</div>

					{/* Information Group */}
					<div>
						<ul className="mt-3">
							<h3 className="text-xs uppercase text-[#331832] font-bold mb-1">
								<span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
									•••
								</span>
								<span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Info</span>
							</h3>
							{/* Privacy policy */}
							<li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/privacy-policy' && 'bg-[#331832]'}`}>
								<NavLink
									end
									to="/privacy-policy"
									className={`block text-slate-800 truncate transition duration-150`}
									style={activeNavlink}
								>
									<div className="flex items-center justify-between">
										<div className="grow flex items-center">
											<BsFillInfoSquareFill
												className={`flex-0 h-6 w-6 ${pathname === '/privacy-policy' ? 'text-white' : 'text-black'}`}
											/>
											<span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
												Privacy Policy
											</span>
										</div>
									</div>
								</NavLink>
							</li>
							{/* Terms of service */}
							<li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/terms-of-service' && 'bg-[#331832]'}`}>
								<NavLink
									end
									to="/terms-of-service"
									className={`block text-slate-800 truncate transition duration-150`}
									style={activeNavlink}
								>
									<div className="flex items-center justify-between">
										<div className="grow flex items-center">
											<BsFillInfoSquareFill
												className={`flex-0 h-6 w-6 ${pathname === '/terms-of-service' ? 'text-white' : 'text-black'}`}
											/>
											<span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
												Terms of Service
											</span>
										</div>
									</div>
								</NavLink>
							</li>
						</ul>
					</div>
				</div>

				{/* Expand / collapse button */}
				<div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
					<div className="px-3 py-2">
						<button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
							<span className="sr-only">Expand / collapse sidebar</span>
							<svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
								<path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
								<path className="text-slate-600" d="M3 23H1V1h2z" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
