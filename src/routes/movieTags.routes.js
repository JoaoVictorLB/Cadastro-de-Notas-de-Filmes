const { Router } = require("express");
const MovieTagsController = require("../controllers/MovieTagsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const movieTagsRoutes = Router();
const movieTagController = new MovieTagsController();

movieTagsRoutes.get("/", ensureAuthenticated, movieTagController.index);

module.exports = movieTagsRoutes;