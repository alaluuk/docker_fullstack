import express from "express";
import cors from "cors";
import "dotenv/config";

import bookRouter from "./routers/book_router.js";

const app = express();
const port = process.env.PORT;

app.use(cors());

app.get("/", async (req, res) => {
  res.send("Postgres API esimerkki");
});

app.use("/book", bookRouter);

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});
