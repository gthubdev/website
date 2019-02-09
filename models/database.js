// Handles the most basic database interactions.
const knex = require("knex");

// Connection options, important data using env variables
const options = {
  client: "pg",
  connection: `postgresql://${process.env.DBUser}:${process.env.DBPass}@${process.env.DBHost}:${process.env.DBPort}/${process.env.DBName}`
};


exports.connect = () => { return knex(options); };