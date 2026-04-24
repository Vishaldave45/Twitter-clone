import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import { env } from "./config/env";
import { attachCurrentUser } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import indexRoutes from "./routes/index.routes";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use("/public", express.static(path.join(process.cwd(), "public")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(attachCurrentUser);

app.use(indexRoutes);
app.use("/",authRoutes);

app.use((_req, res) => {
  res.status(404).render("error", {
    title: "Page not found",
    message: "The page you are looking for does not exist."
  });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
