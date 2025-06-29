const knex = require("../database/knex");

class MovieTagController {
    async index(request, response){
        const user_id = request.user.id;
        const tags = await knex("movieTags").where({ user_id });

        return response.status(200).json(tags);
    }
}

module.exports = MovieTagController;