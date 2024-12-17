import express from "express";
import db from "./config/index.js";
import routes from "./routes/index.js";
import session from "express-session";
import SequelizeSession from "connect-session-sequelize";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const sessionStore = SequelizeSession(session.Store);
const store = new sessionStore({
  db: db,
});

(async () => {
  await db.sync();
})();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use("/api", routes);

// store.sync();
app.listen(process.env.PORT, () => {
  console.log("Server Up and Running..");
});

try {
  await db.authenticate();
  console.log("Database Connected");
} catch (error) {
  console.log(error);
}
