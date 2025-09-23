import { getAll, getOne } from "../models/book_model.js";

export async function getBooks(req, res, next) {
  try {
    const books = await getAll();
    res.json(books);
  } catch (err) {
    next(err);
  }
}

export async function getBook(req, res, next) {
  try {
    const book = await getOne(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
}