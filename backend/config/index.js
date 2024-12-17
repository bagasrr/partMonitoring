import { Sequelize } from "sequelize";

const dbName = "partMonitoring";
const dbUser = "root";
const dbPass = "";
const dbHost = "localhost";

const db = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: "mysql",
});

export default db;
