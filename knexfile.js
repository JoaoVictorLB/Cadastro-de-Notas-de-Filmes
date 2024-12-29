const path = require("path");

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db"),
    },
    pool: {
      // Funcionalidade para ativar as deleções em cascata nas tabelas (não basta apenas setar o onDelete("CASCADE"))
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb),
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations"),
    },
    useNullAsDefault: true,
  },
};