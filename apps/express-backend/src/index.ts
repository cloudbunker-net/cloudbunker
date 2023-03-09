import { addUser } from "./auth/addUser";
import cors from "cors";
import express from "express";
import { rootFolderCreate } from "./auth/rootFolder";
import { router } from "./router";
import { userContext } from "./auth/userContext";
import { verifyJWT } from "./auth";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(verifyJWT);
app.use(userContext); // run after verifyJWT
app.use(addUser); // run after userContext
app.use(rootFolderCreate); // run after addUser

// Routes
app.use("/api", router);

app.listen(3000, () => console.log("Server started on port 3000"));

export { app };
