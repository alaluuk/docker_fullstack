import { Router } from "express";
import { getBooks, getBook, addBook, deleteBook } from "../controllers/book_controller.js";

const bookRouter = Router();

bookRouter.get("/", getBooks);
bookRouter.get("/:id", getBook);
bookRouter.post("/", addBook);
bookRouter.delete("/:id", deleteBook);

export default bookRouter;
