import cors from 'cors';
import express, { Application } from 'express';

import { router } from './router';
import { addUser } from './auth/addUser';
import { verifyJWT } from './auth';
import { userContext } from './auth/userContext';
import { rootFolderCreate } from './auth/rootFolder';

const app: Application = express();

// * Order of the middlewears should be preserved
// * userContext -> addUser -> rootFolderCreate

// Middlewares
app.use(express.json());
app.use(cors());
app.use(verifyJWT);
app.use(userContext);
// Creating user in database on the first login
app.use(addUser);
// Creating root folder in the database on the first login
app.use(rootFolderCreate);

// Routes
app.use('/api', router);

app.listen(3000, () => console.log('Server started on port 3000'));

export { app };
