const { Router } = require("express");
const MovieTagsController = require("../controllers/MovieTagsController");

const movieTagsRoutes = Router();
const movieTagController = new MovieTagsController();

movieTagsRoutes.get("/:user_id", movieTagController.index);

module.exports = movieTagsRoutes;