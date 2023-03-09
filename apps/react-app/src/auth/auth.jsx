import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthProvider = ({ children }) => {
	const history = useNavigate();

	const onRedirectCallback = (appState) => {
		history.push(appState?.returnTo || window.location.pathname);
	};

	return (
		<Auth0Provider
			domain={process.env.AUTH0_DOMAIN}
			clientId={process.env.AUTH0_CLIENT_ID}
			authorizationParams={{
				redirect_uri: window.location.origin,
				audience: 'abcd',
				scope: 'openid profile email',
			}}
		>
			{children}
		</Auth0Provider>
	);
};
