import express from "express";
import db from "./config/index.js";
import routes from "./routes/index.js";
import session from "express-session";
import SequelizeSession from "connect-session-sequelize";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

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
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Gunakan environment variable untuk origin
  })
);

app.use(
  session({
    secret: process.env.SESS_SECRET, // Gunakan environment variable untuk secret
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
      secure: "auto",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use("/api", routes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

try {
  await db.authenticate();
  console.log("Database Connected");
} catch (error) {
  console.log(error);
}
