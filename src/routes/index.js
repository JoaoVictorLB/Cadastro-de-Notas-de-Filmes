const { Router } = require("express");
const usersRouter = require("./users.routes");
const movieNotesRouter = require("./movieNotes.routes");
const movieTagsRouter = require("./movieTags.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/movie-notes", movieNotesRouter);
routes.use("/movie-tags", movieTagsRouter);

module.exports = routes;