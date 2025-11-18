import express from 'express';
import cors from 'cors';
import "dotenv/config";
import session from 'express-session';
import morgan from "morgan";

import Lab5 from './Lab5/index.js';
import Hello from './Hello.js';
import db from './Kambaz/Database/index.js';

import UserRoutes from './Kambaz/Users/routes.js';
import CourseRoutes from "./Kambaz/Courses/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";

const app = express();
app.use(morgan("dev"));

const allowedOrigins = [
  process.env.CLIENT_URL,     
  process.env.CLIENT_URL_2, 
  "http://localhost:3000"     
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked: " + origin));
    },
    credentials: true,
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: "lax" },
  })
);

UserRoutes(app, db);
CourseRoutes(app, db);
EnrollmentRoutes(app, db);
ModuleRoutes(app, db);
AssignmentRoutes(app, db);
Hello(app);
Lab5(app);

app.listen(process.env.PORT || 4000);
