import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

// Import of the App itself
import App from './App';

// Auth0 import for authentication context
import { AuthProvider } from './auth/auth';

// Dnd imports for Chonkie's drag-n-drop feature
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.createRoot(document.getElementById('root')).render(
	// ! Chonky does have an internal DnD component, but it was giving error.
	// ! That is the reason Chonkie's DnD is disabled, and custom one used here.
	<DndProvider backend={HTML5Backend}>
		<React.StrictMode>
			<Router>
				<AuthProvider>
					<App />
				</AuthProvider>
			</Router>
		</React.StrictMode>
	</DndProvider>,
);
