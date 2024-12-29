const { Router } = require("express");
const MovieNotesController = require("../controllers/MovieNotesController");

const moviesNotesRoutes = Router();
const movieNotesController = new MovieNotesController();

moviesNotesRoutes.post("/:user_id", movieNotesController.create);
moviesNotesRoutes.delete("/:id", movieNotesController.delete);
moviesNotesRoutes.get("/:id", movieNotesController.show);
moviesNotesRoutes.get("/", movieNotesController.index);

module.exports = moviesNotesRoutes;