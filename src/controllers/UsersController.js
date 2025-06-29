const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UserController {
  async create(request, response) {
    const { name, email, password } = request.body;
    const [checkUserExists] = await knex("users").where({ email });

    if (checkUserExists) {
      throw new AppError("Este e-mail já está sendo utilizado!");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({ name, email, password: hashedPassword });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password, avatar } = request.body;
    const id = request.user.id;

    const user = await knex("users").where({ id }).first();

    if (!user) {
      throw new AppError("Usuário não encontrado!", 404);
    }

    const [userWithUpdatedEmail] = await knex("users").where({ email });

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso!");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.avatar = avatar ? avatar : user.avatar ? user.avatar : null;

    if (password) {
      if (!old_password) {
        throw new AppError("É necessário informar a senha antiga para definir a nova senha!");
      } else {
        const checkOldPassword = await compare(old_password, user.password);

        if (!checkOldPassword) {
          throw new AppError("A senha antiga não confere!");
        }

        user.password = await hash(password, 8);
      }
    }

    await knex("users").update({ 
        name: user.name,
        email: user.email,
        password: user.password,
        avatar: user.avatar,
        updated_at: knex.fn.now()
     }).where({ id });

    return response.status(200).json();
  }
}

module.exports = UserController;
