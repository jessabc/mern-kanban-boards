import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import { router as boardsRoutes } from "./routes/boards.js";
import { router as userRoutes } from "./routes/user.js";

const app = express();

const corsOptions = {
  origin: "https://frontend-url.com",
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(
  express.urlencoded({
    extended: true,
  })
);

// routes
app.use("/api/boards", boardsRoutes);
app.use("/api/user", userRoutes);

// connect to db
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`app listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.status(201).json({ message: "connected to backend" });
});
