const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const { bookExists, validateBookData, getFilteredBooks, getBookById, validateGenres, books } = require('./helpers/bookHelpers');
let { nextId } = require('./helpers/bookHelpers'); 

app.use(express.json());

app.post('/book', (req, res) => {
  const { title, author, year, price, genres } = req.body;

  const { valid, error } = validateBookData(req.body);
  if (!valid) {
    return res.status(400).json({ errorMessage:error });
  }

  if (bookExists(title)) {
    return res.status(409).json({ errorMessage: `Book with the title [${title}] already exists in the system` });
  }

  const newBook = { id: nextId++, title, author, year, price, genres };
  books.push(newBook);

  res.status(200).json({ result: newBook.id });
});

app.get('/books/health', (req, res) => {
  res.status(200).send("OK")
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/books/total', (req, res) => {
  const { author, 'price-bigger-than': priceBiggerThan, 'price-less-than': priceLessThan, 'year-bigger-than': yearBiggerThan, 'year-less-than': yearLessThan, genres } = req.query;

  if (genres && !validateGenres(genres)) {
    return res.status(400).json({ errorMessage: 'Invalid genres format' });
  }

  const filters = {
    author,
    priceBiggerThan: priceBiggerThan ? Number(priceBiggerThan) : undefined,
    priceLessThan: priceLessThan ? Number(priceLessThan) : undefined,
    yearBiggerThan: yearBiggerThan ? Number(yearBiggerThan) : undefined,
    yearLessThan: yearLessThan ? Number(yearLessThan) : undefined,
    genres
  };

  const filteredBooks = getFilteredBooks(filters);
  res.status(200).json({ result: filteredBooks.length  });
});

app.get('/books', (req, res) => {
  const { author, 'price-bigger-than': priceBiggerThan, 'price-less-than': priceLessThan, 'year-bigger-than': yearBiggerThan, 'year-less-than': yearLessThan, genres } = req.query;

  // Validate genres if provided
  if (genres && !validateGenres(genres)) {
    return res.status(400).json({ errorMessage: 'Invalid genres format' });
  }

  const filters = {
    author,
    priceBiggerThan: priceBiggerThan ? Number(priceBiggerThan) : undefined,
    priceLessThan: priceLessThan ? Number(priceLessThan) : undefined,
    yearBiggerThan: yearBiggerThan ? Number(yearBiggerThan) : undefined,
    yearLessThan: yearLessThan ? Number(yearLessThan) : undefined,
    genres
  };

  const filteredBooks = getFilteredBooks(filters);
  res.status(200).json({ result: filteredBooks });
});

app.get('/book', (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ errorMessage: 'ID parameter is required' });
  }

  const bookId = Number(id);
  const book = getBookById(bookId);

  if (!book) {
    return res.status(404).json({ errorMessage: `Error: no such Book with id ${bookId}` });
  }

  res.status(200).json({ result: book });
});

app.put('/book', (req, res) => {
  const { id, price } = req.query;

  if (!id || !price) {
    return res.status(400).json({ errorMessage: 'ID and price parameters are required' });
  }

  const bookId = Number(id);
  const newPrice = Number(price);

  if (newPrice <= 0) {
    return res.status(409).json({ errorMessage: `Error: price update for book [${bookId}] must be a positive integer` });
  }

  const book = getBookById(bookId);

  if (!book) {
    return res.status(404).json({ errorMessage: `Error: no such Book with id ${bookId}` });
  }

  const oldPrice = book.price;
  book.price = newPrice;

  res.status(200).json({ result:  oldPrice  });
});

app.delete('/book', (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ errorMessage: 'ID parameter is required' });
  }

  const bookId = Number(id);
  const bookIndex = books.findIndex(book => book.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ errorMessage: `Error: no such Book with id ${bookId}` });
  }

  books.splice(bookIndex, 1);

  res.status(200).json({ result: books.length });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
