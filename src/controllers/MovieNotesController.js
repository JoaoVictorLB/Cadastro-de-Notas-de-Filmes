const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MovieNoteConroller {
  async create(request, response) {
    const { title, description, rating, movie_tags } = request.body;
    const user_id = request.user.id;
    
    if ((rating === null || rating === undefined) || rating < 0 || rating > 5) {
      throw new AppError(
        "É necessário inserir um número que represente uma avaliação válida! Por favor selecione um valor na escala de 1 a 5.", 400
      );
    }
    
    const [note_id] = await knex("movieNotes").insert({
      title,
      description,
      rating,
      user_id,
    });
    
    if (movie_tags && movie_tags.length) {
      const tagsInsert = movie_tags.map((tag) => {
        return {
          note_id,
          user_id,
          name: tag,
        };
      });
      
      await knex("movieTags").insert(tagsInsert);
    }
    
    return response.status(201).json();
  }

  async delete(request, response) {
    const { id } = request.params;
    await knex("movieNotes").where({ id }).delete();
    return response.status(200).json();
  }

  async show(request, response) {
    const { id } = request.params;
    const note = await knex("movieNotes").where({ id }).first();
    const tags = await knex("movieTags").where({ note_id: id }).orderBy("name");

    return response.status(200).json({
      ...note,
      tags,
    });
  }

  async index(request, response) {
    const { title, rating, tags } = request.query;
    const user_id = request.user.id;
    
    let movieNotes = null;

    if (tags) {
      const filteredTags = tags.split(",").map((tag) => tag.trim());

      movieNotes = await knex("movieTags")
        .select([
          "movieNotes.title",
          "movieNotes.rating",
          "movieNotes.description",
          "movieNotes.id"
        ])
        .where("movieNotes.user_id", user_id)
        .where({ rating })
        .whereLike("movieNotes.title", `%${title}%`)
        .whereIn("name", filteredTags)
        .innerJoin("movieNotes", "movieNotes.id", "movieTags.note_id")
        .orderBy("movieNotes.title");
    } else if(title) {
      movieNotes = await knex("movieNotes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    } else {
      movieNotes = await knex("movieNotes")
        .select("*")
        .where({ user_id })
        .orderBy("title");
    }

    const userTags = await knex("movieTags").where({ user_id });

    const movieNotesWithTags = movieNotes.map(note => {
        const movieNoteTags = userTags.filter(tag => tag.note_id === note.id);
        
        return {
            ...note,
            tags: movieNoteTags
        }
    });

    return response.status(200).json(movieNotesWithTags);
  }
}

module.exports = MovieNoteConroller;
