import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

// Global styles
import './css/style.css';

// ? Will most likely need to be removed, it was intended
// ? for skeleton loader, but Chonky has its own skeleton loaders
import 'react-loading-skeleton/dist/skeleton.css';

// Chonky imports
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { setChonkyDefaults } from 'chonky';

// All of the pages app uses
import MyFiles from './pages/my-files';
import Shared from './pages/shared';
import Starred from './pages/starred';
import Settings from './pages/settings';

// Authentication
import { useAuth0 } from '@auth0/auth0-react';

// ! Not used anywhere, not sure if we need this
import PageNotFound from './utility/PageNotFound';

function App() {
	const { isLoading, user, loginWithRedirect } = useAuth0();

	const location = useLocation();

	setChonkyDefaults({ iconComponent: ChonkyIconFA });

	useEffect(() => {
		document.querySelector('html').style.scrollBehavior = 'auto';
		window.scroll({ top: 0 });
		document.querySelector('html').style.scrollBehavior = '';
	}, [location.pathname]); // triggered on route change

	return (
		<>
			{/* In case user is not logged in, we give button to get authorized */}
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
			{/* If user have logged in we display the app */}
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
