const { Router } = require("express");
const MovieNotesController = require("../controllers/MovieNotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const moviesNotesRoutes = Router();
const movieNotesController = new MovieNotesController();

moviesNotesRoutes.use(ensureAuthenticated);

moviesNotesRoutes.post("/", movieNotesController.create);
moviesNotesRoutes.delete("/:id", movieNotesController.delete);
moviesNotesRoutes.get("/:id", movieNotesController.show);
moviesNotesRoutes.get("/", movieNotesController.index);

module.exports = moviesNotesRoutes;