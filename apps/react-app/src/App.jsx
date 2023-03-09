import './css/style.css';
import 'react-loading-skeleton/dist/skeleton.css';

import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import MyFiles from './pages/my-files';
import PageNotFound from './utility/PageNotFound';
import Settings from './pages/settings';
import Shared from './pages/shared';
import Starred from './pages/starred';
import { setChonkyDefaults } from 'chonky';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
	const location = useLocation();
	const { isLoading, user, loginWithRedirect } = useAuth0();
	setChonkyDefaults({ iconComponent: ChonkyIconFA });

	useEffect(() => {
		document.querySelector('html').style.scrollBehavior = 'auto';
		window.scroll({ top: 0 });
		document.querySelector('html').style.scrollBehavior = '';
	}, [location.pathname]); // triggered on route change

	return (
		<>
			{!isLoading && !user && (
				<>
					<p className="text-sm text-black m-5">Welcome to the Cloudbunker!</p>
					<p className="text-sm text-black m-5">You found the real app. Congratulations!</p>
					<p className="text-sm text-black m-5">You are not logged in, let's fix that.</p>
					<button
						className="ml-5 inline-flex items-center justify-center rounded-md text-sm font-medium leading-5 px-3 py-1 border border-transparent shadow-sm bg-[#3F7CAC] hover:bg-[#2C5777] text-white duration-150 ease-in-out"
						onClick={() => loginWithRedirect()}
					>
						Sign up / Sign in
					</button>
				</>
			)}
			{!isLoading && user && (
				<>
					<Routes>
						<Route exact path="/" element={<MyFiles />} />
						<Route exact path="/shared" element={<Shared />} />
						<Route exact path="/starred" element={<Starred />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="*" element={<PageNotFound />} />
					</Routes>
				</>
			)}
		</>
	);
}

export default App;
