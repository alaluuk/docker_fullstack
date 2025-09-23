import { Router } from "express";
import { getBooks, getBook } from "../controllers/book_controller.js";

const bookRouter = Router();

bookRouter.get("/", getBooks);
bookRouter.get("/:id", getBook);

export default bookRouter;
