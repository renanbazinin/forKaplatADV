// helpers/bookHelpers.js
let books = [];
let nextId = 1;

const validGenres = ["SCI_FI", "NOVEL", "HISTORY", "MANGA", "ROMANCE", "PROFESSIONAL"];

const bookExists = (title) => {
  return books.some(book => book.title.toLowerCase() === title.toLowerCase());
};

const validateBookData = (book) => {
  const { title, author, year, price, genres } = book;
  if (typeof title !== 'string' || typeof author !== 'string' || typeof price !== 'number' || typeof year !== 'number' || !Array.isArray(genres)) {
    return { valid: false, error: 'All fields are required' };
  }
  if (year < 1940 || year > 2100) {
    return { valid: false, error: `Error: Can’t create new Book that its year [${year}] is not in the accepted range [1940 -> 2100]` };
  }
  if (price <= 0) {
    return { valid: false, error: 'Error: Can’t create new Book with negative price' };
  }
  return { valid: true };
};

const getFilteredBooks = (filters) => {
  return books.filter(book => {
    const { author, priceBiggerThan, priceLessThan, yearBiggerThan, yearLessThan, genres } = filters;

    if (author && book.author.toLowerCase() !== author.toLowerCase()) return false;
    if (priceBiggerThan && book.price < priceBiggerThan) return false;
    if (priceLessThan && book.price > priceLessThan) return false;
    if (yearBiggerThan && book.year < yearBiggerThan) return false;
    if (yearLessThan && book.year > yearLessThan) return false;
    if (genres) {
      const genresArray = genres.split(',').map(genre => genre.trim());
      const hasGenre = genresArray.some(genre => book.genres.includes(genre));
      if (!hasGenre) return false;
    }

    return true;
  }).sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
};


const getBookById = (id) => {
  return books.find(book => book.id === id);
};

const validateGenres = (genres) => {
  const genresArray = genres.split(',').map(genre => genre.trim());
  return genresArray.every(genre => validGenres.includes(genre));
};

module.exports = {
  bookExists,
  validateBookData,
  getFilteredBooks,
  getBookById,
  validateGenres,
  books,
  nextId
};
